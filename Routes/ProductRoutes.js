const express = require("express");
const Prod = require("../Models/ProductModel.js");
const Email = require("../Models/Email.js");
const { checkSchema } = require("express-validator");

const { Validate, myown1 } = require("../MiddleWares/Validator.js");
const { Mongoose } = require("mongoose");
const { errorHandler } = require("../MiddleWares/Error.js");

const ProductRoute = express.Router();
ProductRoute.get("/postall", (req, res) => {
  const a = Prod.insertMany(
    [
      {   name: "Blood Pressure Monitors Product",
      images: [
        "https://www.pharmananda.com/upload/img/fe52e32d9d037c0.jpg",
        "https://www.pharmananda.com/upload/img/67e5f54ad43ce38.jpg",
        " https://www.pharmananda.com/upload/img/b3bd88a1f317d41.jpg"
      ],
      description: {
        string1:
          "Speed and accuracy lorem ipsum aren’t just a prediction, they’re a promise. Understanding patient response to both progression of their medical condition as well as various treatment options is vital to developing the best care plan.",
        string2:
          "Monitoring patient vital signs, such as heart rate and temperature, help manage your patients' health. Cardinal Health offers complete tympanic, oral/axillary and rectal thermometers, as well as all of the necessary components and accessories to help clinicians provide better patient care through fast and accurate temperature measurement.",
      },
      price: 130.55,
      countInStock: 4,
      rating: 4,
      numReviews: 2,
      reviews: [],
    }, 
   {   name: "Nebulizer Product",
      images: [
        "https://www.pharmananda.com/upload/img/63e27cc73c3c90a.png",
        "https://www.pharmananda.com/upload/img/3a85eea2b6f6df9.jpg"
      ],
      description: {
        string1:
          "Speed and accuracy lorem ipsum aren’t just a prediction, they’re a promise. Understanding patient response to both progression of their medical condition as well as various treatment options is vital to developing the best care plan.",
        string2:
          "Monitoring patient vital signs, such as heart rate and temperature, help manage your patients' health. Cardinal Health offers complete tympanic, oral/axillary and rectal thermometers, as well as all of the necessary components and accessories to help clinicians provide better patient care through fast and accurate temperature measurement.",
      },
      price: 130.55,
      countInStock: 4,
      rating: 5,
      numReviews: 2,
      reviews: [],
    },
      
      
      {
        name: "Diabetes Devices Product",
        images: [
          "https://www.pharmananda.com/upload/img/2803eb181daa38b.jpg",
          "https://www.pharmananda.com/upload/img/a7ab956bac306df.jpg"
        ],
        description: {
          string1:
            "Speed and accuracy lorem ipsum aren’t just a prediction, they’re a promise. Understanding patient response to both progression of their medical condition as well as various treatment options is vital to developing the best care plan.",
          string2:
            "Monitoring patient vital signs, such as heart rate and temperature, help manage your patients' health. Cardinal Health offers complete tympanic, oral/axillary and rectal thermometers, as well as all of the necessary components and accessories to help clinicians provide better patient care through fast and accurate temperature measurement.",
        },
        price: 130.55,
        countInStock: 4,
        rating: 4,
        numReviews: 2,
        reviews: [],
      },

      {
        name: "ELECTROSURGICAL GENERATORS ",
        images: [
          "https://www.medtronic.com/content/dam/covidien/library/global/en/product/electrosurgical-hardware/valleylab-ls10-generator.jpg",
        ],
        description: {
          string1:
            "Speed and accuracy lorem ipsum aren’t just a prediction, they’re a promise. Understanding patient response to both progression of their medical condition as well as various treatment options is vital to developing the best care plan.",
          string2:
            "Monitoring patient vital signs, such as heart rate and temperature, help manage your patients' health. Cardinal Health offers complete tympanic, oral/axillary and rectal thermometers, as well as all of the necessary components and accessories to help clinicians provide better patient care through fast and accurate temperature measurement.",
        },
        price: 130.55,
        countInStock: 4,
        rating: 4,
        numReviews: 2,
        reviews: [],
      },

      {
        name: "Cardinal Health Medical Thermometers ",
        images: [
          "https://media-s3-us-east-1.ceros.com/cardinal-health/images/2019/07/29/5ee2342b3be46fe7b6a7887a6abc8319/main-image-hi-res.jpg?imageOpt=1&fit=bounds&width=851",
        ],
        description: {
          string1:
            "Speed and accuracy aren’t just a prediction, they’re a promise. Understanding patient response to both progression of their medical condition as well as various treatment options is vital to developing the best care plan.",
          string2:
            "Monitoring patient vital signs, such as heart rate and temperature, help manage your patients' health. Cardinal Health offers complete tympanic, oral/axillary and rectal thermometers, as well as all of the necessary components and accessories to help clinicians provide better patient care through fast and accurate temperature measurement.",
        },
        price: 130.55,
        countInStock: 4,
        rating: 4.5,
        numReviews: 2,
        reviews: [],
      },
      {
        name: "Invacare Perfecto2 V Oxygen Concentrator 5-Liter w/O2 Sensor IRC5PO2",
        images: [
          "https://www.vitalitymedical.com/media/catalog/product/cache/21f717a5a4491c4366455175eca0b3cb/i/n/invacare-irc5po2v-perfecto2-v-oxygen-concentrator_1.jpg",
          "https://www.vitalitymedical.com/media/catalog/product/cache/21f717a5a4491c4366455175eca0b3cb/p/e/perfecto2-v-profile_1.jpg",
        ],
        description: {
          string1:
            "Perfecto 2 Oxygen Concentrator 5 Liter is a small size home oxygen machine. It is less than 2 feet tall, making it easy to hide when not in use. When it is in use, it uses less power than most O2 concentrators while maintaining the same oxygen output. It offers up to 5 liters of continuous oxygen per minute. This design keeps your power bill low without sacrificing your health. It offers quiet operation, making it ideal for use while sleeping.",
          string2:
            "Invacare Perfecto2 provides humification with its oxygen therapy. Just simply attach a humidifier bottle with distilled water to the device with its built-in, easily accessible bottle holder. It also has three distinct filters so there's always a pure supply of oxygen. Also, this O2 machine uses a pressure monitor instead of a timer to give a steady flow of oxygen.",
        },
        price: 999.99,
        countInStock: 6,
        rating: 3,
        numReviews: 2,
        reviews: [],
      },
      {
        name: "Hospital Beds for Home Usage ",
        images: [
          "https://www.vitalitymedical.com/media/catalog/product/cache/21f717a5a4491c4366455175eca0b3cb/5/4/5410ivc-bed.png",
          "https://www.vitalitymedical.com/media/catalog/product/cache/21f717a5a4491c4366455175eca0b3cb/f/i/file_130_2_1.jpg",
        ],
        description: {
          string1:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
          string2:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        },
        price: 1424.0,
        countInStock: 7,
        rating: 5,
        numReviews: 4,
        reviews: [],
      },
    ],
    function (err) {
      console.log(err);
    }
  );

  console.log("products added");
});
ProductRoute.post(
  "/postemail",
  checkSchema(myown1),
  Validate,
  async (req, res) => {
    {
      /*

const email='4d'
  const EmailExist = await Email.findOne({ email });
  if (EmailExist) {
    res.status(400).json({err:'Email Sub already exist'});
    console.log("Email Sub already exist");
  } else {
    const a = new Email({
     email
    });
    if (a) {
      const createdemail = await a.save();
      res.status(201).json(createdemail);
    } else {
      res.status(400);
      console.log("error");
    }
  }

*/
    }
    const { email } = req.body;

    const EmailExist = await Email.findOne({ email });
    if (EmailExist) {
      res.status(400).json({ err: "Email Sub already exist" });
      console.log("Email Sub already exist");
    } else {
      const a = new Email({ email });
      if (a) {
        const createdemail = await a.save();
        res.status(201).json(createdemail);
      } else {
        res.status(400).json({ err: "unknown error" });
        console.log("error");
      }
    }
  }
);

ProductRoute.get("/getemails", async (req, res) => {
  const EMAILS = await Email.find({});
  if (EMAILS) {
    res.status(201).json(EMAILS);
    console.log("EmailS");
  } else {
    res.status(400).json({ err: "ERROR GETTING EMAILS" });
  }
});

ProductRoute.get(
  "/all",
  async (req, res) => {
    const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};


    let a
    if (req.query?.keyword === "" ) {
      try {
    a = await Prod.find({});
      
      res.json({products:a,productss:a});
      } catch (err) {
        errorHandler(err,req,res )
      }
      
    
    } else {
      try {
        console.log(req.query.keyword);
        a = await Prod.aggregate([
          {
            $search: {
              index: "searchName",
              autocomplete: {
                query: `${req.query.keyword}`,
                path: "name",
              },
            },
          },
        
        ]);
        a=await Prod.find({... {name: 
          {
            $regex: req.query.keyword,
            $options: "i",
          }}
        
        })
         const b = await Prod.find({});
    res.json({products:a,productss:b});
      } catch (err) {
        errorHandler(err,req,res );
      }
    }
   
  }
 
   
);


ProductRoute.get("/", async (req, res) => {
  
  Prod.findById(req.query.id)
  .then(product => {
      if(product) {
          res.json(product)
      } else {
          res.status(404).json({message: 'Product not found' })
      }
  })
  .catch(err => errorHandler(err,req,res))  



});

module.exports = ProductRoute;
