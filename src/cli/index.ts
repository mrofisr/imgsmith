#!/usr/bin/env node

import { Command } from "commander";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pc from "picocolors";
import { doctor } from "./commands/doctor.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, "../../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

const program = new Command();

program
  .name("imgsmith")
  .description(pc.cyan("Forge optimized images for the modern web"))
  .version(packageJson.version);

program
  .command("doctor")
  .description("Check for required dependencies")
  .action(async () => {
    await doctor();
  });

program.parse();
