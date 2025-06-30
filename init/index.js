const mongoose = require('mongoose');
const Blog = require("../models/blog.js"); 
const { data } = require("./data.js");

const dbUrl = "mongodb://localhost:27017/Blog-App";

main()
  .then(async () => {
    console.log("connected to db");

    await Blog.deleteMany({}); 

    await Blog.insertMany(data); 
    console.log("New data inserted!");

    mongoose.connection.close(); 
  })
  .catch((err) => {
    console.log("Error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
