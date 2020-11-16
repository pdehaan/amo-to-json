#!/usr/bin/env node

const { parse } = require("json2csv");
const lib = require("./lib");

main();

async function main() {
  const reviewsJson = await lib.getReviews(process.env.ADDON_ID || 2633704);
  const reviewsCsv = jsonToCsv(reviewsJson);
  console.log(reviewsCsv);
}

function jsonToCsv(data = {}) {
  return parse(data, {
    fields: ["body", "created", "id", "score", "user", "version", "reply"],
  });
}
