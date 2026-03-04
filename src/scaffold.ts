// src/scaffold.ts
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import execa from "execa";
import { PortfolioData } from "./prompt";

export async function scaffoldProject(data: PortfolioData) {
  const projectPath = path.resolve(process.cwd(), data.projectName);

  if (fs.existsSync(projectPath)) {
    console.error(
      `\n❌ Folder "${data.projectName}" already exists. Please choose a different name.`,
    );
    process.exit(1);
  }

  const spinner = ora("Scaffolding Next.js app...").start();

  try {
    await execa(
      "npx",
      [
        "create-next-app@latest",
        data.projectName,
        "--typescript",
        "--tailwind",
        "--app",
        "--no-git",
        "--no-eslint",
        "--import-alias",
        "@/*",
        "--use-npm",
        "--yes",
      ],
      {
        cwd: process.cwd(),
        stdio: "inherit",
      },
    );

    spinner.succeed("Next.js app scaffolded!");

    // Poll until app/ folder exists before proceeding
    console.log("Looking for:", path.join(projectPath, "app"));
    console.log("Project path exists:", fs.existsSync(projectPath));
    console.log(
      "Contents:",
      fs.existsSync(projectPath)
        ? fs.readdirSync(projectPath)
        : "folder missing",
    );

    // Poll until app/ folder exists before proceeding
    let retries = 10;
    while (retries > 0) {
      if (fs.existsSync(path.join(projectPath, "app"))) break;
      await new Promise((res) => setTimeout(res, 500));
      retries--;
    }
  } catch (err) {
    spinner.fail("Failed to scaffold Next.js app.");
    throw err;
  }

  const depsSpinner = ora("Installing dependencies...").start();
  await execa("npm", ["install", "framer-motion"], {
    cwd: projectPath,
    stdio: "ignore",
  });
  depsSpinner.succeed("Dependencies installed!");

  const dataSpinner = ora("Writing portfolio data...").start();

  try {
    await new Promise((res) => setTimeout(res, 500));

    await fs.ensureDir(projectPath);

    await fs.writeJSON(path.join(projectPath, "portfolio-data.json"), data, {
      spaces: 2,
    });
    dataSpinner.succeed("Portfolio data written!");
  } catch (err) {
    dataSpinner.fail("Failed to write portfolio data.");
    throw err;
  }
  return projectPath;
}
