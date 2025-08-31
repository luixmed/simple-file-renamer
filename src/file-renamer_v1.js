import fs from "fs";
import path from "path";
import { createNewFilesNames } from "./utils/filename-utils.js";
import { log, error, debug, success } from "./utils/logger.js";
import { config } from "./utils/config.js";

// 1. Read and parse the file list
function readFileList(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf-8" }, (readErr, data) => {
      if (readErr) {
        return reject(`Failed to read file: ${readErr.message}`);
      }

      const pairs = createNewFilesNames(data);
      if (pairs.length === 0) {
        return reject("No valid filenames found in the input file.");
      }

      debug(`Found ${pairs.length} files to process`);
      resolve(pairs);
    });
  });
}

// 2. Check if a file exists
function checkFileExists(filePath) {
  return new Promise((resolve) => {
    fs.access(filePath, (err) => {
      resolve(!err);
    });
  });
}

// 3. Rename a single file
function renameSingleFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (renameErr) => {
      if (renameErr) {
        reject(`Failed to rename: ${renameErr.message}`);
      } else {
        resolve();
      }
    });
  });
}

// 4. Process all files (main logic)
async function processFiles(pairs, sourceDir, reportFile) {
  const summary = [];

  for (const [oldName, newName] of pairs) {
    const oldPath = path.join(sourceDir, oldName);
    const newPath = path.join(sourceDir, newName);

    try {
      // Check if source file exists
      const fileExists = await checkFileExists(oldPath);
      if (!fileExists) {
        summary.push(`❌ Source file not found: ${oldName}`);
        continue;
      }

      // Rename the file
      await renameSingleFile(oldPath, newPath);
      summary.push(`✅ Renamed ${oldName} → ${newName}`);
    } catch (error) {
      summary.push(`❌ Failed to rename ${oldName}: ${error}`);
    }
  }

  return summary;
}

// 5. Generate the report
function generateReport(summary, outputPath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outputPath, summary.join("\n"), (writeErr) => {
      if (writeErr) {
        reject(`Failed to write summary: ${writeErr.message}`);
      } else {
        resolve(summary);
      }
    });
  });
}

// Main exported function (now much cleaner)
export async function renameFiles(options) {
  const { inputFile, sourceDir, reportFile } = options;

  try {
    // Initialize logger with options if needed
    debug(`Starting rename operation with options: ${JSON.stringify(options)}`);

    // Read and parse the file list
    log("📖 Reading the list...");
    const pairs = await readFileList(inputFile);

    // Process all files
    log("🔄️ Processing files...");
    const summary = await processFiles(pairs, sourceDir, reportFile);

    // Generate report
    log("📊 Generating report...");
    await generateReport(summary, reportFile);

    success("Rename operation completed successfully");
    debug(`Summary written to: ${reportFile}`);

    return summary;
  } catch (err) {
    error(`Operation failed: ${err}`);
    throw err;
  }
}
