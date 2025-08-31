import fs from "fs";
import path from "path";
import { config } from "../src/utils/config.js";
import { log, success, debug } from "../src/utils/logger.js";

export function prepareTemp() {
  const { data, tempData } = config.paths;
  const filesToCopy = config.filesToCopy;

  // Clean up old temp_data if it exists
  if (fs.existsSync(tempData)) {
    log("🧹 Cleaning up old temp_data directory...");
    fs.rmSync(destDir, { recursive: true, force: true });
  }

  // Recreate temp_data
  log("📁 Creating temp_data directory...");
  fs.mkdirSync(destDir);

  // Copy only selected files
  log("📋 Copying files to temp_data...");
  filesToCopy.forEach((file) => {
    const srcPath = path.join(data, file);
    const destPath = path.join(tempData, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      debug(`Copied: ${file}`);
    }
  });

  success("temp_data directory prepared with fresh files");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  prepareTemp();
}
