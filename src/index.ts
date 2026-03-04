#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { runPrompts } from "./prompt";
import { scaffoldProject } from "./scaffold";
import { generatePortfolio } from "./generator";

async function main() {
  console.log(
    chalk.cyan(figlet.textSync("Portfolio Builder", { font: "Small" })),
  );
  console.log(chalk.gray("  Let's build your portfolio step by step.\n"));

  const data = await runPrompts();

  console.log();

  const projectPath = await scaffoldProject(data);
  console.log(
    chalk.green("✔ Project scaffolded at:"),
    chalk.white(projectPath),
  );
  console.log(chalk.gray("\nNext up: generating your portfolio..."));
  console.log("Project path:", projectPath);
  console.log("Project name:", data.projectName);
  await generatePortfolio(data, projectPath);

  console.log(chalk.green("\n✔ Your portfolio is ready!\n"));
  console.log(chalk.white(`  cd ${data.projectName}`));
  console.log(chalk.white("  npm run dev\n"));
  console.log(chalk.yellow("  📸 Profile photo:"));
  console.log(
    chalk.gray(
      `  Drop your photo into ${data.projectName}/public/ and name it profile.jpg or profile.png\n`,
    ),
  );

  console.log();
}

main().catch((err) => {
  console.error(chalk.red("\n✖ Something went wrong:"), err.message);
  process.exit(1);
});
