const {MongoClient}=require("mongodb")

const uri = process.env.MONGO_URI || "mongodb://localhost:27017"

const client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology:true})

let db;

const connectDB = async (databaseName)=>{
  try {
    await client.connect()
    db = client.db(databaseName)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log(error)
  }
}

const getDB = ()=>{
  if(!db){
    throw new Error("Database not initialized")
  }
  return db;
}
module.exports = {connectDB,getDB}