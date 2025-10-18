import { MongoClient } from "mongodb";
import DATABASE_LINK from "./database link.js";
const CONNECTION_STRING=DATABASE_LINK;
const client=new MongoClient(CONNECTION_STRING);
await client.connect();
const database=client.db("RecipeBook");
console.log("Connected to database");
export default database;
