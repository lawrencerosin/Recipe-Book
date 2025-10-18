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

});
book.get("/accountCreation", async function(request, response){
   
   matchedUsernames=await accounts.find({username:request.query.username}).toArray();
 console.log(matchedUsernames);
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
  console.log("insert");
  
   response.send("Checking Sign In");
});
book.get("/signIn", function(request, response){
   response.render("create account");
});
book.use(express.json());
book.get("/check", async function(request, response){
  
  const signInCheck=await recipes.findOne({username:1, _id:0}, [{username:request.query.username}, {password:request.query.password}]);
  
});
book.listen(4000, function(){
  console.log("Running");
});