import fs from "fs";
import path from "path";
import { renameFiles } from "../src/file-renamer_v1.js";

async function runTests() {
  console.log("🧪 Starting V1 Tests...\n");

  // Test 1: Nonexisting input file (NEW: tests the fs.access check)
  const missingFilePath = path.join(process.cwd(), "data", "nonexisting.txt");
  console.log("1. 🔍 Test: Missing input file");
  try {
    await renameFiles(missingFilePath);
    console.log("   ❌ FAIL: Should have thrown an error");
  } catch (err) {
    if (err.includes("Input file not found")) {
      console.log("   ✅ PASS: Correctly rejected missing input file");
    } else {
      console.log("   ❌ FAIL: Unexpected error:", err);
    }
  }

  // Test 2: Empty file
  const emptyFilePath = path.join(process.cwd(), "data", "empty.txt");
  if (!fs.existsSync(emptyFilePath)) {
    fs.writeFileSync(emptyFilePath, "");
  }
  console.log("\n2. 🔍 Test: Empty file");
  try {
    const result = await renameFiles(emptyFilePath);
    if (result === "⚠️ No valid filenames found.") {
      console.log("   ✅ PASS: Correctly handled empty file");
    } else {
      console.log("   ❌ FAIL: Unexpected result:", result);
    }
  } catch (err) {
    console.log("   ❌ FAIL: Should not throw for empty file:", err);
  }

  // Test 3: Valid rename summary
  const validFilePath = path.join(process.cwd(), "data", "old_names.txt");
  console.log("\n3. Test: Valid rename operation");
  try {
    const summary = await renameFiles(validFilePath);
    const successCount = summary.filter((line) => line.includes("✅")).length;
    console.log(`   ✅ PASS: Processed ${successCount} files successfully`);
    summary.forEach((line) => console.log("   ", line));
  } catch (err) {
    console.log("   ❌ FAIL: Should not throw for valid operation:", err);
  }

  // Test 4: NEW - Missing source files in temp_data
  console.log("\n4. 🔍 Test: Missing source files in temp_data");
  try {
    // Temporarily move a file to make it missing
    const fileToHide = path.join(process.cwd(), "temp_data", "notes.md");
    const hiddenPath = path.join(process.cwd(), "temp_data", "notes.md.hidden");

    if (fs.existsSync(fileToHide)) {
      fs.renameSync(fileToHide, hiddenPath);
    }

    const summary = await renameFiles(validFilePath);

    // Check if the summary contains the expected error
    const missingFileError = summary.find((line) =>
      line.includes("❌ Source file not found: notes.md")
    );

    if (missingFileError) {
      console.log("   ✅ PASS: Correctly handled missing source file");
    } else {
      console.log("   ❌ FAIL: Missing file error not found in summary");
      console.log("   Summary:", summary);
    }

    // Restore the file for other tests
    if (fs.existsSync(hiddenPath)) {
      fs.renameSync(hiddenPath, fileToHide);
    }
  } catch (err) {
    console.log("   ❌ FAIL: Should not throw for missing source files:", err);
  }

  console.log("\n🧪 All tests completed");
}

runTests();
