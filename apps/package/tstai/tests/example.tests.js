import { name_app } from "../src/index.js";

const baseurl = "http://localhost:3006/v1/auth";

name_app("TEST REGISTER USER WITH EMAIL=chandancr515@gmail.com, PASS=123456, name=Chandan expect 201", {
  baseurl
})
