const mongoose = require("mongoose");
const formSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      trim: true,
      minLength: 4
    },
    firstName: {
      type: String,
      required: [true, "First Name"],
      trim: true,
      minLength: 4

    },
    lastName: {
      type: String,
      required: [true, "Last Name"],
      trim: true,
      minLength: 4
    },
    budget: {
      type: Number,
      require: true,
      minLength: 4
      
    },
    phone: {
      type: Number,
      require: true,
    },
    address: {
      type: String,
      require: true,
      minLength: 4
    },
    country: {
      type: String,
      require: true,
      minLength: 2
    },
    region: {
      type: String,
      require: true,
      minLength: 1
    },
    date: {
      type: Date,
      require: true,
    
    },totalAmount:{
      type:Number,
      require:true
    },
    items:{
      type:Array,
      require:true
    }

  },
  {
    timestamps: true,
  }
);
const Form = mongoose.model("Form", formSchema);
module.exports = Form;
