import pc from "picocolors";

export const logger = {
  info: (msg: string): void => console.log(pc.blue("ℹ") + " " + msg),
  success: (msg: string): void => console.log(pc.green("✓") + " " + msg),
  warn: (msg: string): void => console.log(pc.yellow("⚠") + " " + msg),
  error: (msg: string): void => console.error(pc.red("✗") + " " + msg),
  header: (msg: string): void => console.log("\n" + pc.bold(pc.cyan(msg)) + "\n"),
};
