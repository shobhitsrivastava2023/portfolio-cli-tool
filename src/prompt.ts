import inquirer from "inquirer";

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface PortfolioData {
  projectName: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  theme: string;
  accentColor: string;
}



// --- Types ---
export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface PortfolioData {
  projectName: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  theme: string;
  accentColor: string;
}

// Basic info
async function askBasicInfo() {
  return inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project folder name:",
      default: "my-portfolio",
    },
    {
      type: "input",
      name: "name",
      message: "Your full name:",
      validate: (v) => v.length > 0 || "Name is required",
    },
    {
      type: "input",
      name: "title",
      message: "Your title/role (e.g. Full Stack Engineer):",
      validate: (v) => v.length > 0 || "Title is required",
    },
    {
      type: "input",
      name: "bio",
      message: "Short bio (2-3 sentences about you):",
    },
  ]);
}

// Social links
async function askSocialLinks() {
  return inquirer.prompt([
    { type: "input", name: "email", message: "Email:" },
    { type: "input", name: "github", message: "GitHub URL:" },
    { type: "input", name: "linkedin", message: "LinkedIn URL:" },
    { type: "input", name: "twitter", message: "Twitter/X URL (optional):" },
  ]);
}

// Skills — loop until user is done
async function askSkills(): Promise<string[]> {
  const skills: string[] = [];

  while (true) {
    const { skill } = await inquirer.prompt([
      {
        type: "input",
        name: "skill",
        message:
          skills.length === 0
            ? "Add a skill (e.g. React):"
            : "Add another skill (or press Enter to finish):",
      },
    ]);

    if (!skill) break;
    skills.push(skill);
  }

  return skills;
}

// Experience — loop until user is done
async function askExperience(): Promise<Experience[]> {
  const experiences: Experience[] = [];

  const { addExperience } = await inquirer.prompt([
    {
      type: "confirm",
      name: "addExperience",
      message: "Add work experience?",
      default: true,
    },
  ]);

  if (!addExperience) return experiences;

  while (true) {
    const entry = await inquirer.prompt([
      { type: "input", name: "company", message: "Company name:" },
      { type: "input", name: "role", message: "Your role:" },
      { type: "input", name: "startDate", message: "Start date (e.g. Jan 2022):" },
      { type: "input", name: "endDate", message: "End date (or 'Present'):" },
      { type: "input", name: "description", message: "What did you do there?" },
    ]);

    experiences.push(entry);

    const { another } = await inquirer.prompt([
      {
        type: "confirm",
        name: "another",
        message: "Add another experience?",
        default: false,
      },
    ]);

    if (!another) break;
  }

  return experiences;
}

// Projects — loop until user is done
async function askProjects(): Promise<Project[]> {
  const projects: Project[] = [];

  while (true) {
    const { addProject } = await inquirer.prompt([
      {
        type: "confirm",
        name: "addProject",
        message:
          projects.length === 0
            ? "Add a project?"
            : "Add another project?",
        default: true,
      },
    ]);

    if (!addProject) break;

    const entry = await inquirer.prompt([
      { type: "input", name: "name", message: "Project name:" },
      { type: "input", name: "description", message: "What does it do?" },
      {
        type: "input",
        name: "techStack",
        message: "Tech stack (comma-separated, e.g. React, Node, Postgres):",
      },
      { type: "input", name: "liveUrl", message: "Live URL (optional):" },
      { type: "input", name: "githubUrl", message: "GitHub URL (optional):" },
    ]);

    projects.push({
      ...entry,
      techStack: entry.techStack.split(",").map((t: string) => t.trim()),
    });
  }

  return projects;
}

// Theme selection
async function askTheme() {
  return inquirer.prompt([
    {
      type: "list",
      name: "theme",
      message: "Choose a theme:",
      choices: [
        { name: "Dark Minimal", value: "dark-minimal" },
        { name: "Retro Terminal", value: "retro" },
        { name: "Glass / Frosted", value: "glass" },
        { name: "Editorial / Bold", value: "editorial" },
      ],
    },
    {
      type: "list",
      name: "accentColor",
      message: "Choose an accent color:",
      choices: [
        { name: "Cyan", value: "cyan" },
        { name: "Orange", value: "orange" },
        { name: "Rose", value: "rose" },
        { name: "Violet", value: "violet" },
        { name: "Emerald", value: "emerald" },
      ],
    },
  ]);
}
// at the bottom of src/prompts.ts
export async function runPrompts(): Promise<PortfolioData> {
  const basic = await askBasicInfo();
  const social = await askSocialLinks();
  const skills = await askSkills();
  const experience = await askExperience();
  const projects = await askProjects();
  const { theme, accentColor } = await askTheme();  // ← destructure explicitly

  return {
    ...basic,
    ...social,
    skills,
    experience,
    projects,
    theme,          // ← now TS knows these exist
    accentColor,
  };
}