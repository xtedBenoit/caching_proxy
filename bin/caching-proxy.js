#!/usr/bin/env node
import { Command } from "commander";
import { startServer } from "../src/index.js";
import { clearCache } from "../src/cache.js";

const program = new Command();

program
  .option("--port <number>")
  .option("--origin <url>")
  .option("--clear-cache");

program.parse(process.argv);
const options = program.opts();

if (options.clearCache) {
  clearCache();
  console.log("Cache cleared.");
  process.exit();
}

if (!options.port || !options.origin) {
  console.log("Usage: caching-proxy --port <number> --origin <url>");
  process.exit(1);
}

startServer(options.port, options.origin);
