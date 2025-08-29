import fs from "fs";
import path from "path";

const srcDir = "data";
const destDir = "temp_data";

// Clean up old temp_data if it exists
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}

// Recreate temp_data
fs.mkdirSync(destDir);

// Copy files from data to temp_data
fs.readdirSync(srcDir).forEach((file) => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  fs.copyFileSync(srcPath, destPath);
});
