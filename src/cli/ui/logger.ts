// Native ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

const colorize = (color: string, text: string): string => {
  return `${color}${text}${colors.reset}`;
};

// Export colors for use in other modules
export const color = {
  blue: (text: string): string => colorize(colors.blue, text),
  green: (text: string): string => colorize(colors.green, text),
  yellow: (text: string): string => colorize(colors.yellow, text),
  red: (text: string): string => colorize(colors.red, text),
  cyan: (text: string): string => colorize(colors.cyan, text),
  bold: (text: string): string => colorize(colors.bold, text),
  dim: (text: string): string => colorize(colors.dim, text),
};

export const logger = {
  info: (msg: string): void =>
    console.log(colorize(colors.blue, "ℹ") + " " + msg),
  success: (msg: string): void =>
    console.log(colorize(colors.green, "✓") + " " + msg),
  warn: (msg: string): void =>
    console.log(colorize(colors.yellow, "⚠") + " " + msg),
  error: (msg: string): void =>
    console.error(colorize(colors.red, "✗") + " " + msg),
  header: (msg: string): void =>
    console.log("\n" + colorize(colors.bold + colors.cyan, msg) + "\n"),
};
