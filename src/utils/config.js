import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Central configuration object
export const config = {
  paths: {
    data: path.join(__dirname, "../data"),
    tempData: path.join(__dirname, "../temp_data"),
    scripts: path.join(__dirname, "../scripts"),
    defaultInput: path.join(__dirname, "../data/old_names.txt"),
    defaultReport: path.join(__dirname, "../data/renamed_files.txt"),
  },
  filesToCopy: ["demo.txt", "notes.md", "report.log"],
  prefix: "new_",
};

// Helper to get absolute paths
export function getPath(key) {
  return config.paths[key];
}
