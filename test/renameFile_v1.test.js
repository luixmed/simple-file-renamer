import fs from "fs";
import path from "path";
import { renameFiles } from "../src/file-renamer_v1.js";

// Test 1: Nonexisting file
const missingFilePath = path.join(process.cwd(), "data", "nonexisting.txt");
console.log("🔍 Test: Missing file");
renameFiles(missingFilePath);

// Test 2: Empty file
const emptyFilePath = path.join(process.cwd(), "data", "empty.txt");

// Create empty file if it doesn't exist
if (!fs.existsSync(emptyFilePath)) {
  fs.writeFileSync(emptyFilePath, "");
}

console.log("\n🔍 Test: Empty file");
renameFiles(emptyFilePath);
