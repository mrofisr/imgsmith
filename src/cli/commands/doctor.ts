import { checkAllDependencies } from "../../detection/dependencies";
import { logger } from "../ui/logger";

export async function doctor(): Promise<void> {
  logger.header("Dependency Check");

  const result = await checkAllDependencies();

  for (const dep of result.dependencies) {
    if (dep.installed) {
      logger.success(`${dep.name} ${dep.version ? `(${dep.version})` : ""}`);
    } else {
      logger.error(`${dep.name} is missing`);
      if (dep.installGuide) {
        console.log(`  Run: ${dep.installGuide}`);
      }
    }
  }

  console.log();
  if (result.allInstalled) {
    logger.success("All dependencies are installed!");
  } else {
    logger.warn("Some dependencies are missing. Install them and try again.");
  }
}
