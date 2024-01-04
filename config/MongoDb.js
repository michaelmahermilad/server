const mongoose =require("mongoose");
const Prod=require("../Models/ProductModel.js") 

const connectDatabase =  () => {
  
 
     mongoose.connect(process.env.MongoUrl, {useUnifiedTopology: true , useNewUrlParser: true})

    const connection = mongoose.connection

    connection.on('connected' , ()=>{
        console.log('Mongo DB Connection Successfull')
      
    })

    connection.on('error' , ()=>{
        console.log('Mongo DB Connection Error')
    })

 



};
connectDatabase()

module.exports = mongoose