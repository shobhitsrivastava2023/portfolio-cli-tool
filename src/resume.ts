import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import Anthropic from "@anthropic-ai/sdk";
const pdfParse = require("pdf-parse");
import { PortfolioData } from "./prompt";

export async function runResumeFlow(): Promise<Omit<PortfolioData, "theme">> {

  // API Key
  const { apiKey } = await inquirer.prompt([{
    type: "password",
    name: "apiKey",
    message: "Enter your Anthropic API key:",
    mask: "*",
    validate: (v: string) => {
      if (!v) return "API key is required";
      if (!v.startsWith("sk-ant-")) return "Invalid key format, should start with sk-ant-";
      return true;
    },
  }]);

  // Resume path
  const { resumePath } = await inquirer.prompt([{
    type: "input",
    name: "resumePath",
    message: "Path to your resume PDF:",
    validate: (v: string) => {
      if (!v) return "Path is required";
      if (!fs.existsSync(v)) return `File not found at: ${v}`;
      if (!v.toLowerCase().endsWith(".pdf")) return "File must be a PDF";
      return true;
    },
  }]);

  // Read PDF
  const readSpinner = ora("Reading resume...").start();
  let resumeText = "";

  try {
    const pdfBuffer = await fs.readFile(resumePath);
    const pdfData = await pdfParse(pdfBuffer);
    resumeText = pdfData.text;
    readSpinner.succeed("Resume read!");
  } catch (err) {
    readSpinner.fail("Failed to read PDF.");
    throw new Error(`Could not read PDF: ${(err as Error).message}`);
  }

  if (resumeText.trim().length < 100) {
    throw new Error(
      "Could not extract enough text from the PDF.\n  Make sure it's not a scanned image — it needs a real text layer."
    );
  }

  // Send to Claude
  const aiSpinner = ora("Extracting details with AI...").start();

  let parsed: Omit<PortfolioData, "theme">;

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `
Extract portfolio information from this resume and return ONLY a valid JSON object.
No explanation, no markdown, no code blocks. Just the raw JSON.

Required format:
{
  "projectName": "my-portfolio",
  "name": "Full Name",
  "title": "Job Title or Role",
  "bio": "2-3 sentence professional summary written in first person",
  "email": "email or empty string",
  "github": "full github url or empty string",
  "linkedin": "full linkedin url or empty string",
  "twitter": "full twitter url or empty string",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Role Title",
      "startDate": "Mon Year",
      "endDate": "Mon Year or Present",
      "description": "1-2 sentence summary of what you did and impact"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "1-2 sentences on what it does and why it matters",
      "techStack": ["tech1", "tech2"],
      "liveUrl": "url or empty string",
      "githubUrl": "url or empty string"
    }
  ]
}

Rules:
- bio must be written in first person (I built, I led, etc.)
- Keep descriptions concise but meaningful
- If something is missing from the resume, use an empty string or empty array
- projectName should always be "my-portfolio"
- Extract ALL experience and projects you can find

Resume:
${resumeText}
        `.trim(),
      }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";

    // Strip markdown code fences if Claude added them anyway
    const cleaned = raw.trim().replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");

    parsed = JSON.parse(cleaned);
    aiSpinner.succeed("Details extracted!");

  } catch (err) {
    aiSpinner.fail("AI extraction failed.");

    if ((err as Error).message.includes("JSON")) {
      throw new Error("AI returned unexpected format. Please try again.");
    }
    if ((err as Error).message.includes("401")) {
      throw new Error("Invalid API key. Please check and try again.");
    }
    throw err;
  }

  // Show summary
  console.log("\n  ✦ Here's what we found:\n");
  console.log(`    Name        ${parsed.name}`);
  console.log(`    Title       ${parsed.title}`);
  console.log(`    Email       ${parsed.email || "—"}`);
  console.log(`    GitHub      ${parsed.github || "—"}`);
  console.log(`    LinkedIn    ${parsed.linkedin || "—"}`);
  console.log(`    Skills      ${parsed.skills.length} skills`);
  console.log(`    Experience  ${parsed.experience.length} entries`);
  console.log(`    Projects    ${parsed.projects.length} entries`);
  console.log();

  const { looksGood } = await inquirer.prompt([{
    type: "confirm",
    name: "looksGood",
    message: "Does this look right?",
    default: true,
  }]);

  if (!looksGood) {
    console.log("\n  No problem — you can edit the generated files directly after.\n");
  }

  return parsed;
}