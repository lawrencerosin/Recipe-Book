import express from "express";
import database from "./scripts/database.js";
const book=express();
let matchedUsernames;
const accounts=database.collection("Accounts");
const recipes=database.collection("Recipes");
book.set("view engine", "ejs");
book.set("views","./templates"); 
book.get("/createAccount", function(request, response){
    response.render("create account")
});
book.get("/", function(request, response){
    response.render("recipes")
});
book.get("/accountCreation", async function(request, response){
   
   matchedUsernames=await accounts.find({username:request.query.username}).toArray();
 
  if(Object.keys(matchedUsernames).length==0){
  
         await accounts.insertOne({username: request.query.username, password: request.query.password});
   
    response.render("account creation");
   
  }
  else{
    response.render("account exists");
  }
});
book.use(express.json());
book.post("/accountCreation", async function(request, response){
  await accounts.insertOne({username: request.query.username, password: request.query.password});
   
  
   response.send("Checking Sign In");
});
book.get("/signIn", function(request, response){
   response.render("create account");
});
book.use(express.json());
book.get("/check", async function(request, response){
  
  const signInCheck=await accounts.find({username:request.query.username}).toArray();
   
  if(signInCheck.length==0){
    response.send(`<script>sessionStorage.setItem("username", ${request.query.username}</script><h1>Failed to Sign In</h1><br/><a href="/signIn">Click here to sign in again.</a>`);
  }
  else{
    response.send(`<h1>Successfully Signed In</h1><br/><a href="/">Click here to create and view a recipe</a>`);
  }
});
book.get("/saveAs/:username/:recipeName/:recipe", async function(request, response){
   await recipes.insertOne({creator:request.params.username, name: request.params.recipeName, ingredients: request.params.recipe});
  response.send("hello");
});
book.post("/saveAs/:username/:recipeName/:recipe", async function(request, response){
 //await recipes.insertOne({creator:request.params.username, name: request.params.recipeName, ingredients: request.params.recipe});
});
book.get("/open/:username/:recipeName", async function(request, response){
    const opening=recipes.findOne({_id:0, name:1, ingredients:1}, {creator:request.params.username, {name: request.params.recipeName}});
    response.send("hello");
  console.log(openings.name);
});
book.listen(4000, function(){
  console.log("Running");
});