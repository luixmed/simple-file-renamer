import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { createNewFilesNames } from "./utils/filename-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function renameFiles(options) {
  return new Promise((resolve, reject) => {
    const { inputFile, sourceDir, reportFile } = options;

    fs.access(inputFile, (notFoundErr) => {
      if (notFoundErr) {
        return reject(`❌ Input file not found: ${inputFile}`);
      }

      fs.readFile(inputFile, { encoding: "utf-8" }, (readErr, data) => {
        if (readErr) {
          return reject(`❌ Failed to read file: ${readErr.message}`);
        }

        const pairs = createNewFilesNames(data);
        if (pairs.length === 0) {
          return resolve("⚠️ No valid filenames found.");
        }

        const summary = [];
        const workingDir = sourceDir;

        let completed = 0;
        pairs.forEach(([oldName, newName]) => {
          const oldPath = path.join(workingDir, oldName);
          const newPath = path.join(workingDir, newName);

          fs.access(oldPath, (notFoundErr) => {
            if (notFoundErr) {
              // Push error message and skip rename operation
              summary.push(`❌ Source file not found: ${oldName}`);
              completed++;
              if (completed === pairs.length) {
                writeSummary(summary, outPath, resolve, reject);
              }
              return; // Move to next file
            }

            // ONLY IF EXISTS: Proceed with rename operation
            fs.rename(oldPath, newPath, (renameErr) => {
              summary.push(
                renameErr
                  ? `❌ Failed to rename ${oldName}: ${renameErr.message}`
                  : `✅ Renamed ${oldName} → ${newName}`
              );
              completed++;
              if (completed === pairs.length) {
                writeSummary(summary, reportFile, resolve, reject);
              }
            });
          });
        });
      });
    });
  });
}

// Helper function to handle summary writing
function writeSummary(summary, outputPath, resolve, reject) {
  fs.writeFile(outputPath, summary.join("\n"), (writeErr) => {
    if (writeErr) {
      return reject(`❌ Failed to write summary: ${writeErr.message}`);
    }
    console.log(`📄 Summary written to ${outputPath}`);
    resolve(summary);
  });
}
