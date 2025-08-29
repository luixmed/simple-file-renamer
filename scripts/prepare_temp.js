import fs from "fs";
import path from "path";

const srcDir = "data";
const destDir = "temp_data";
const filesToCopy = ["demo.txt", "notes.md", "report.log"];

// Clean up old temp_data if it exists
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}

// Recreate temp_data
fs.mkdirSync(destDir);

// Copy only selected files
filesToCopy.forEach((file) => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});
