import fs from "fs";
import path from "path";
import { renameFiles } from "../src/file-renamer_v1.js";

async function runTests() {
  // Test 1: Nonexisting file
  const missingFilePath = path.join(process.cwd(), "data", "nonexisting.txt");
  console.log("🔍 Test: Missing file");
  try {
    await renameFiles(missingFilePath);
  } catch (err) {
    console.error(err);
  }

  // Test 2: Empty file
  const emptyFilePath = path.join(process.cwd(), "data", "empty.txt");
  if (!fs.existsSync(emptyFilePath)) {
    fs.writeFileSync(emptyFilePath, "");
  }
  console.log("\n🔍 Test: Empty file");
  try {
    const result = await renameFiles(emptyFilePath);
    console.log(result);
  } catch (err) {
    console.error(err);
  }

  // Test 3: Valid rename summary
  const validFilePath = path.join(process.cwd(), "data", "old_names.txt");
  console.log("\n Test: rename summary");
  try {
    const summary = await renameFiles(validFilePath);
    summary.forEach((line) => console.log(line));
  } catch (err) {
    console.error(err);
  }
}

runTests();
