#!/usr/bin/env node

const arg = require("arg");
const lib = require("./lib");

const args = arg({
  '--output': String,
  // Aliases
  '-o': '--output',
});

main(args['--output'])
  .catch(err => {
    console.error(err.message);
    process.exitCode = 1;
  });

async function main(output = "json") {
  let data = await lib.getReviews(process.env.ADDON_ID || 2633704);
  switch (output.toLowerCase()) {
    case "json":
      data = JSON.stringify(data, null, 2);
      break;
    case "csv":
      data = lib.jsonToCsv(data);
      break;
    default:
      throw new Error(`Unknown output format: "${output}". Expected "JSON" or "CSV"`);
  }
  console.log(data);
}
