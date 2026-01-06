import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger, color } from "../src/cli/ui/logger.js";

describe("Logger", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("logger.info", () => {
    it("should log info messages", () => {
      logger.info("Test message");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Test message")
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("ℹ")
      );
    });

    it("should use blue color for info", () => {
      logger.info("Test");
      const call = consoleLogSpy.mock.calls[0]?.[0];
      expect(call).toContain("\x1b[34m"); // Blue ANSI code
    });
  });

  describe("logger.success", () => {
    it("should log success messages", () => {
      logger.success("Success message");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Success message")
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("✓")
      );
    });

    it("should use green color for success", () => {
      logger.success("Test");
      const call = consoleLogSpy.mock.calls[0]?.[0];
      expect(call).toContain("\x1b[32m"); // Green ANSI code
    });
  });

  describe("logger.warn", () => {
    it("should log warning messages", () => {
      logger.warn("Warning message");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Warning message")
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("⚠")
      );
    });

    it("should use yellow color for warnings", () => {
      logger.warn("Test");
      const call = consoleLogSpy.mock.calls[0]?.[0];
      expect(call).toContain("\x1b[33m"); // Yellow ANSI code
    });
  });

  describe("logger.error", () => {
    it("should log error messages", () => {
      logger.error("Error message");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error message")
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("✗")
      );
    });

    it("should use red color for errors", () => {
      logger.error("Test");
      const call = consoleErrorSpy.mock.calls[0]?.[0];
      expect(call).toContain("\x1b[31m"); // Red ANSI code
    });
  });

  describe("logger.header", () => {
    it("should log header messages with newlines", () => {
      logger.header("Header");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const call = consoleLogSpy.mock.calls[0]?.[0];
      expect(call).toContain("Header");
      expect(call).toMatch(/^\n/); // Starts with newline
      expect(call).toMatch(/\n$/); // Ends with newline
    });

    it("should use bold cyan for headers", () => {
      logger.header("Test");
      const call = consoleLogSpy.mock.calls[0]?.[0];
      expect(call).toContain("\x1b[1m"); // Bold ANSI code
      expect(call).toContain("\x1b[36m"); // Cyan ANSI code
    });
  });

  describe("color utilities", () => {
    it("should provide blue color function", () => {
      const result = color.blue("test");
      expect(result).toContain("test");
      expect(result).toContain("\x1b[34m");
      expect(result).toContain("\x1b[0m"); // Reset
    });

    it("should provide green color function", () => {
      const result = color.green("test");
      expect(result).toContain("\x1b[32m");
    });

    it("should provide yellow color function", () => {
      const result = color.yellow("test");
      expect(result).toContain("\x1b[33m");
    });

    it("should provide red color function", () => {
      const result = color.red("test");
      expect(result).toContain("\x1b[31m");
    });

    it("should provide cyan color function", () => {
      const result = color.cyan("test");
      expect(result).toContain("\x1b[36m");
    });

    it("should provide bold color function", () => {
      const result = color.bold("test");
      expect(result).toContain("\x1b[1m");
    });

    it("should provide dim color function", () => {
      const result = color.dim("test");
      expect(result).toContain("\x1b[2m");
    });

    it("should reset colors after text", () => {
      const result = color.green("test");
      expect(result).toMatch(/test\x1b\[0m$/);
    });
  });
});
