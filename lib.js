const axios = require("axios");
const sortJson = require("sort-json");

const BASE_URL = "https://addons.mozilla.org/";

const client = axios.create({
  baseURL: BASE_URL,
});

module.exports = {
  getReviews,
}

async function getReviews(addon, page = 1) {
  let reviews = [];
  let res;
  do {
    res = await client.get("/api/v4/ratings/rating/", {
      params: {
        page,
        page_size: 50,
        addon,
      },
    });
    reviews = reviews.concat(res.data.results);
    page += 1;
  } while (res.data.next);

  return reviews
    .map((review) => {
      review.user = review.user.name;
      review.version = review.version.version;
      review.reply = review.reply?.body;
      delete review.addon;
      delete review.is_deleted;
      delete review.is_developer_reply;
      delete review.is_latest;
      delete review.previous_count;
      return sortJson(review);
    })
    .filter((review) => !review.is_deleted || !review.is_developer_reply);
}
