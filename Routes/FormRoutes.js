const express = require("express");
const Form = require("../Models/Form.js");
 
const { checkSchema } = require("express-validator");

const { Validate, myown1,formOrder } = require("../MiddleWares/Validator.js");
const { Mongoose } = require("mongoose");
const { errorHandler } = require("../MiddleWares/Error.js");

const FormRoute = express.Router();
FormRoute.post(
  "/postform",
  checkSchema(formOrder),
  Validate,
  async (req, res) => {
    const { email,budget,lastName ,firstName,phone,address,date,country,region,items,totalAmount} = req.body;
    const FormExist = await Form.findOne({ email,budget,lastName ,firstName,phone,address,date,country,region });
    if (FormExist) {
      res.status(400).json({ err: "Form already exist" });
  console.log(FormExist)
    } else {
      const a = new Form({  email,budget,lastName ,firstName,phone,address,date,country,region,items,totalAmount});
      if (a) {
        const createdform = await a.save();
        res.status(201).json(createdform);
        
      } else {
        res.status(400).json({ err: "unknown error" });
        console.log("error");
      }
    }
  }
);

FormRoute.get("/getbyemail/:email", async (req, res) => {
  const {email}=req.params
  Form.find({email})
  .then(forms => {
      if(forms) {
          res.json(forms)
      } else {
          res.status(404).json({message: 'forms not found' })
      }
  })
  .catch(err => errorHandler(err,req,res))  



});




module.exports = FormRoute;
