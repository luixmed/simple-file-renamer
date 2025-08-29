import { createNewFilesNames } from "../src/file-renamer_v1.js";

const input = `
    demo.txt
    notes.md
    report.log
`;

const expected = [
  ["demo.txt", "new_demo.txt"],
  ["notes.md", "new_notes.md"],
  ["report.log", "new_report.log"],
];

const result = createNewFilesNames(input);

console.log(
  "✅ Test result:",
  JSON.stringify(result) === JSON.stringify(expected) ? "PASS" : "FAIL"
);

console.log("Result:", result);
