# amo-to-json

> Convert AMO reviews to a JSON or CSV file.

## USAGE

### CLI

```sh
# Output as JSON
npx pdehaan/amo-to-json > reviews.json

# Output as CSV
npx pdehaan/amo-to-json -o csv > reviews.csv
```

### API

```js
// npm i pdehaan/amo-to-json
const amo = require("amo-to-json");

main();

async function main() {
  const reviewsJson = await amo.getReviews(2633704);
  const reviewsCsv = jsonToCsv(reviewsJson);
  console.log(reviewsCsv);
}
```
