const mongoose=require("mongoose") ;
 const emailSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
 
  },
  {
    timestamps: true,
  }
);
const Email = mongoose.model("Email", emailSchema);
module.exports= Email;
