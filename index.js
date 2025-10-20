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
   
  
});
book.use(express.json());
book.post("/accountCreation", async function(request, response){
    matchedUsernames=await accounts.find({username:request.query.username}).toArray();
  if(Object.keys(matchedUsernames).length==0){
  
         await accounts.insertOne({username: request.query.username, password: request.query.password});
   
    response.render("account creation");
   
  }
  else{
    response.render("account exists");
  }
   
  
  
});
book.get("/signIn", function(request, response){
   response.render("create account");
});
book.use(express.json());
book.get("/check", async function(request, response){
  
  const signInCheck=await accounts.find({username:request.query.username}).toArray();
   
  if(signInCheck.length==0){
    response.send(`<h1>Failed to Sign In</h1><br/><a href="/signIn">Click here to sign in again.</a>`);
   
  }
  else{
    response.send(`<script>sessionStorage.setItem("username", "${request.query.username}");</script><h1>Successfully Signed In</h1><br/><a href="/">Click here to create and view a recipe</a>`);
  }
}); 
function IntoObjectArray(ingredientList){
   const ingredients=[];
   const ingredientArray=ingredientList.split(";");
   for(let ingredient of ingredientArray){
     const PROPERTIES=["amount", "unit", "name"];
     const parts=ingredient.split(",");
     const ingredientParts={};
     for(let position=0; position<PROPERTIES.length; position++){
        ingredientParts[PROPERTIES[position]]=parts[position];
     }
     ingredients.push(ingredientParts);
   }
   return ingredients;
}
book.post("/saveAs", async function(request, response){
   
 await recipes.insertOne({creator:request.query.username, name: request.query.recipeName, ingredients: IntoObjectArray(request.query.recipe)});
});
book.post("/open", async function(request, response){
    const opening=await recipes.findOne({creator:request.query.username, name:request.query.recipe}, {_id:0, creator:0, name:0, ingredients:1});
    console.log(opening);
    if(opening===null){
       response.send("Recipe doesn't exist")
    }
    else{
    response.send(opening["ingredients"])
    }
  
});
book.put("/save/:username/:recipeName/:recipe", async function(request, response){
   await recipes.updateOne({name: request.params.recipeName, creator:request.params.username},{$set:{ingredients:request.params.recipe}})
});
book.delete("/deleteRecipe", function(request, response){
  recipes.deleteOne({creator:request.query.username, name:request.query.name});
  response.send("deleted");
});
book.listen(4000, function(){
  console.log("Running");
});