import { name_app } from "../src/index.js";

const baseurl = "https://jsonplaceholder.typicode.com";

name_app("Test GET /posts endpoint returns 200 and list of posts", {
  baseurl,
});

name_app("Test POST /posts with title and body data, expect status 201", {
  baseurl,
});

name_app("Test GET /users/1 endpoint returns 200 and user data", {
  baseurl,
});
