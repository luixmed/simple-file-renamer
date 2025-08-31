import { config } from "./config.js";

export function createNewFilesNames(text) {
  return text.split("\n").reduce((namePairs, oldName) => {
    oldName = oldName.trim();
    if (oldName) {
      namePairs.push([oldName, `${config.prefix}${oldName}`]);
    }
    return namePairs;
  }, []);
}
