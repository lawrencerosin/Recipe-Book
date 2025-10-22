import express from "express";
import database from "./scripts/database.js";
const book=express();
let matchedUsernames;
const accounts=database.collection("Accounts");
const recipes=database.collection("Recipes");
const profile=database.collection("Profile");
book.set("view engine", "ejs");
book.set("views","./templates"); 
book.get("/createAccount", function(request, response){
    response.render("create account")
});
book.use("/templates/css", express.static("public"));
book.get("/", async function(request, response){
     
     
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
         await profile.insertOne({username: request.query.username, public:false});
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
  
  const signInCheck=await accounts.find({username:request.query.username, password:request.query.password}).toArray();
   
  if(signInCheck.length==0){
    response.send(`<style>body{background-color:red;}</style><h1 style="color:white">Failed to Sign In</h1><br/><a href="/signIn">Click here to sign in again.</a>`);
   
  }
  else{
    response.send(`<style>body{background-color:yellow;}</style><script> sessionStorage.setItem("username", "${request.query.username}");</script><h1 style="color:white">Successfully Signed In</h1><br/><a href="/">Click here to create and view a recipe</a>`);
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
book.get("/profile", function(request, response){
   
   response.render("profile");
});
book.post("/profileContent/:username", async function(request, response){
   const profileContent=await profile.findOne({username:request.params.username}, {_id:0, username:1, public:1, email:1});
   response.send(profileContent);
});
function GetRecipes(recipes){
   let recipeList="<h3 style='color:white'>Your Recipes</h3><ul>";
   for(let recipe of recipes){
       recipeList+=`<li>${recipe["name"]}</li>`;
   }
   return recipeList;
}
book.get("/viewMyRecipes/:username", async function(request,response){
   const myRecipes=await recipes.find({creator:request.params.username}, {_id:0, name:1}).toArray();
   
   response.send(`<style>#back{background-color:blue; color:yellow;} body{background-color:lightblue; } ul{list-style-type:none; background-color:white; width:100px;}li{ border:1px solid black; text-align:center; width:100px;}</style><button onclick="window.location.href='/'" id="back">Back</button>${GetRecipes(myRecipes)}`);
});
book.put("/profileContent", async function(request, response){
   await profile.updateOne({username:request.query.username}, {$set:{name:request.query.name, email:request.query.email}});
   response.send("Success");
});
 
book.listen(4000, function(){
  console.log("Running");
});