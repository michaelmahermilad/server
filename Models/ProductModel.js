const mongoose=require("mongoose") ;
const reviewSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
  },
  comment: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
});
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    images: {
      type: [],
      require: true,
    },
    description: {
      type: {},
      require: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      require: true,
      default: 4,
    },
    numReviews: {
      type: Number,
      require: true,
      default: 0,
    },
    price: {
      type: Number,
      require: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Prod = mongoose.model("Prod", productSchema);
module.exports= Prod;
