import fs from "fs";

export function createNewFilesNames(text) {
  return text.split("\n").reduce((namePairs, oldName) => {
    oldName = oldName.trim();
    if (oldName) namePairs.push([oldName, `new_${oldName}`]);
    return namePairs;
  }, []);
}
