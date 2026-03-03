// src/scaffold.ts
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import execa from "execa";
import { PortfolioData } from "./prompt";

export async function scaffoldProject(data: PortfolioData) {
  const projectPath = path.resolve(process.cwd(), data.projectName);

 
  if (fs.existsSync(projectPath)) {
    console.error(`\n❌ Folder "${data.projectName}" already exists. Please choose a different name.`);
    process.exit(1);
  }

  const spinner = ora("Scaffolding Next.js app...").start();

  try {
    await execa("npx", [
      "create-next-app@latest",
      data.projectName,
      "--typescript",
      "--tailwind",
      "--app",
      "--no-git",
      "--no-eslint",
      "--import-alias", "@/*",
      "--use-npm",
    ], {
      cwd: process.cwd(),
      stdio: "ignore",   
    });

    spinner.succeed("Next.js app scaffolded!");
  } catch (err) {
    spinner.fail("Failed to scaffold Next.js app.");
    throw err;
  }


const dataSpinner = ora("Writing portfolio data...").start();

try {

  await new Promise(res => setTimeout(res, 500));

  await fs.ensureDir(projectPath);

  await fs.writeJSON(
    path.join(projectPath, "portfolio-data.json"),
    data,
    { spaces: 2 }
  );
  dataSpinner.succeed("Portfolio data written!");
} catch (err) {
  dataSpinner.fail("Failed to write portfolio data.");
  throw err;
}
  return projectPath;
}