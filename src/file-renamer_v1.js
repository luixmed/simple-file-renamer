import fs from "fs";

export function createNewFilesNames(text) {
  return text.split("\n").reduce((namePairs, oldName) => {
    oldName = oldName.trim();
    if (oldName) namePairs.push([oldName, `new_${oldName}`]);
    return namePairs;
  }, []);
}

export function renameFiles(filePath) {
  fs.readFile(filePath, { encoding: "utf-8" }, (readErr, data) => {
    if (readErr) {
      console.error("❌ Failed to read file:", readErr.message);
      return;
    }

    const pairs = createNewFilesNames(data);
    if (pairs.length === 0) {
      console.log("⚠️ No valid filenames found.");
      return;
    }
  });
}
