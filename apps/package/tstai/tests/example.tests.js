import { tstai } from "../src/index.js";

tstai("GET request to https://jsonplaceholder.typicode.com/posts should return 200", {
    baseurl: "https://jsonplaceholder.typicode.com"
});

tstai("GET request to https://jsonplaceholder.typicode.com/posts/1 should return 200", {
    baseurl: "https://jsonplaceholder.typicode.com"
});

tstai("GET request to https://jsonplaceholder.typicode.com/users should return 200", {
    baseurl: "https://jsonplaceholder.typicode.com"
});

tstai("GET request to https://jsonplaceholder.typicode.com/users/1 should return 200", {
    baseurl: "https://jsonplaceholder.typicode.com"
});

tstai("post request to http://localhost:3005/signup, with vlaues username and pass should return 200",{
    baseurl:"http://localhost:3005",
    method:"POST",
    body:{
        username:"test",
        pass:"test"
    }
})
