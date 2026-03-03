#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { runPrompts } from "./prompt";
import { scaffoldProject } from "./scaffold";

async function main() {
  console.log(
    chalk.cyan(figlet.textSync("Portfolio Builder", { font: "Small" }))
  );
  console.log(chalk.gray("  Let's build your portfolio step by step.\n"));


  const data = await runPrompts();


  console.log();
  const projectPath = await scaffoldProject(data);


  console.log();
  console.log(chalk.green("✔ Project scaffolded at:"), chalk.white(projectPath));
  console.log(chalk.gray("\nNext up: generating your portfolio..."));
}

main().catch((err) => {
  console.error(chalk.red("\n✖ Something went wrong:"), err.message);
  process.exit(1);
});