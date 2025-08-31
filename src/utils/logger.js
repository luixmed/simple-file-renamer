// Simple logging utility that respects verbose and silent flags
let verbose = false;
let silent = false;

export function initLogger(options = {}) {
  verbose = options.verbose || false;
  silent = options.silent || false;
}

export function log(message) {
  if (!silent) {
    console.log(message);
  }
}

export function info(message) {
  if (!silent) {
    console.log("ℹ️ " + message);
  }
}

export function success(message) {
  if (!silent) {
    console.log("✅ " + message);
  }
}

export function warning(message) {
  if (!silent) {
    console.log("⚠️ " + message);
  }
}

export function error(message) {
  if (!silent) {
    console.error("❌ " + message);
  }
}

export function debug(message) {
  if (verbose && !silent) {
    console.log("🐛 " + message);
  }
}
