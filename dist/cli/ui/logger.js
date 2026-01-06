import pc from "picocolors";
export const logger = {
    info: (msg) => console.log(pc.blue("ℹ") + " " + msg),
    success: (msg) => console.log(pc.green("✓") + " " + msg),
    warn: (msg) => console.log(pc.yellow("⚠") + " " + msg),
    error: (msg) => console.error(pc.red("✗") + " " + msg),
    header: (msg) => console.log("\n" + pc.bold(pc.cyan(msg)) + "\n"),
};
//# sourceMappingURL=logger.js.map