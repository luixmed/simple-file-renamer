import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract version from CLI args
const versionArg = process.argv.find((arg) => arg.startsWith("--version="));
const version = versionArg ? versionArg.split("=")[1] : "v1";

const renamerPath = path.join(__dirname, `file-renamer_v${version}.js`);
const inputPath = path.join(__dirname, "../data/old_names.txt");

try {
  const renamerModule = await import(pathToFileURL(renamerPath).href);
  if (typeof renamerModule.renameFiles === "function") {
    renamerModule
      .renameFiles(inputPath)
      .then((summary) => {
        console.log("✅ Rename operation complete.");
        console.log(summary.join("\n"));
      })
      .catch((err) => {
        console.error(err);
      });
  }
} catch (err) {
  console.error(`❌ Failed to load file-renamer_${version}.js`);
  console.error(err.message);
  process.exit(1);
}
