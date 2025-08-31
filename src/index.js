#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import and run prepare_temp if needed
async function ensureTempData() {
  try {
    const preparePath = path.join(__dirname, "../scripts/prepare_temp.js");
    const prepareModule = await import(pathToFileURL(preparePath).href);
    console.log("🛠️ Preparing temp_data directory...");
    if (typeof prepareModule.prepareTemp === "function") {
      await prepareModule.prepareTemp();
    }
  } catch (error) {
    console.warn("⚠️ Could not prepare temp_data directory:", error.message);
    console.warn("⚠️ Continuing without preparation...");
  }
}

// Use the working approach: parse first, then handle command manually
const parsedArgs = yargs(hideBin(process.argv))
  .scriptName("file-renamer")
  .option("input", {
    alias: "i",
    describe: "Path to the file containing the list of old names",
    type: "string",
    default: path.join(__dirname, "../data/old_names.txt"),
  })
  .option("source", {
    alias: "s",
    describe: "Directory containing the files to be renamed",
    type: "string",
    default: path.join(__dirname, "../temp_data"),
  })
  .option("report", {
    alias: "r",
    describe: "Path where the summary report will be written",
    type: "string",
    default: path.join(__dirname, "../data/renamed_files.txt"),
  })
  .option("verbose", {
    alias: "v",
    describe: "Print detailed progress information",
    type: "boolean",
    default: false,
  })
  .option("no-prepare", {
    describe: "Skip automatic preparation of temp_data directory",
    type: "boolean",
    default: false,
  })
  .help()
  .alias("h", "help")
  .parse();

// Manual command handling - THIS IS THE KEY FIX
const command = parsedArgs._[0];
const version = parsedArgs._[1];

if (command === "run" && ["v1", "v2", "v3"].includes(version)) {
  main(version, parsedArgs);
} else {
  console.log("Usage: file-renamer run <v1|v2|v3> [options]");
  console.log("Example: file-renamer run v1 --verbose");
  process.exit(1);
}

async function main(version, args) {
  const { input, source, report, verbose, noPrepare } = args;

  if (verbose) {
    console.log("🔧 Starting file renamer with options:");
    console.log(`   Version: ${version}`);
    console.log(`   Input file: ${input}`);
    console.log(`   Source directory: ${source}`);
    console.log(`   Report file: ${report}`);
  }

  // Prepare temp_data if not disabled
  if (!noPrepare) {
    await ensureTempData();
  }

  const renamerPath = path.join(__dirname, `file-renamer_${version}.js`);

  try {
    const renamerModule = await import(pathToFileURL(renamerPath).href);

    if (typeof renamerModule.renameFiles === "function") {
      renamerModule
        .renameFiles({
          inputFile: input,
          sourceDir: source,
          reportFile: report,
        })
        .then((summary) => {
          console.log("✅ Rename operation complete.");
          if (verbose) {
            console.log("📊 Summary:");
            summary.forEach((line) => console.log(`   ${line}`));
          }
        })
        .catch((err) => {
          console.error("❌ Operation failed:", err);
          process.exit(1);
        });
    } else {
      throw new Error("Module does not export renameFiles function");
    }
  } catch (err) {
    console.error(`❌ Failed to load file-renamer_${version}.js`);
    console.error(err.message);
    process.exit(1);
  }
}
