import { tstai } from "tstai";


tstai("GET request to /posts should return 200", {
    baseurl: "https://jsonplaceholder.typicode.com"
});

tstai("GET request to /users should return 200", {
    baseurl: "https://jsonplaceholder.typicode.com"
});

tstai("GET request to /posts/1 should return 200", {
    baseurl: "https://jsonplaceholder.typicode.com"
});
