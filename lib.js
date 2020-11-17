const axios = require("axios");
const { parse } = require("json2csv");
const sortJson = require("sort-json");

const BASE_URL = "https://addons.mozilla.org/";

const client = axios.create({
  baseURL: BASE_URL,
});

module.exports = {
  getApiHref,
  getReviews,
  jsonToCsv,
}

function getApiHref(addon) {
  const url = new URL("/api/v4/ratings/rating/", BASE_URL);
  url.search = new URLSearchParams({
    addon,
    page: 1,
    page_size: 50
  });
  return url.href;
}

async function getReviews(addon) {
  const reviews = [];
  let href = getApiHref(addon);
  // Fetch all reviews, without using recursion...
  do {
    const res = await client.get(href);
    reviews.push(res.data.results);
    href = res.data.next;
  } while (href);

  return reviews
    .flat()
    .filter(review => !review.is_deleted || !review.is_developer_reply)
    .map((review) => {
      review.reply = review.reply?.body;
      review.url = new URL(`/firefox/addon/private-relay/reviews/${review.id}/`, BASE_URL).href;
      review.user = review.user.name;
      review.version = review.version.version;
      delete review.addon;
      delete review.is_deleted;
      delete review.is_developer_reply;
      delete review.is_latest;
      delete review.previous_count;
      return sortJson(review);
    });
}

function jsonToCsv(data = {}) {
  return parse(data, {
    fields: ["body", "created", "id", "score", "user", "version", "reply"],
  });
}
