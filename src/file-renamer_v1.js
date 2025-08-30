import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = path.join(__dirname, "../data/old_names.txt");
const outPath = path.join(__dirname, "../data/renamed_files.txt");

export function createNewFilesNames(text) {
  return text.split("\n").reduce((namePairs, oldName) => {
    oldName = oldName.trim();
    if (oldName) namePairs.push([oldName, `new_${oldName}`]);
    return namePairs;
  }, []);
}

export function renameFiles(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf-8" }, (readErr, data) => {
      if (readErr) {
        return reject(`❌ Failed to read file: ${readErr.message}`);
      }

      const pairs = createNewFilesNames(data);
      if (pairs.length === 0) {
        return resolve("⚠️ No valid filenames found.");
      }

      const summary = [];
      const workingDir = path.join(__dirname, "../temp_data");

      let completed = 0;
      pairs.forEach(([oldName, newName]) => {
        const oldPath = path.join(workingDir, oldName);
        const newPath = path.join(workingDir, newName);

        fs.rename(oldPath, newPath, (err) => {
          summary.push(
            err
              ? `❌ Failed to rename ${oldName}: ${err.message}`
              : `✅ Renamed ${oldName} → ${newName}`
          );
          completed++;
          if (completed === pairs.length) {
            fs.writeFile(outPath, summary.join("\n"), (writeErr) => {
              if (writeErr) {
                return reject(
                  `❌ Failed to write summary: ${writeErr.message}`
                );
              }
              console.log(`📄 Summary written to ${outPath}`);
              resolve(summary);
            });
          }
        });
      });
    });
  });
}
