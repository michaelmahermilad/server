const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
var nodemailerTransport = require("nodemailer-mailgun-transport");
const { protect, admin } = require("../MiddleWares/AuthMiddleware.js");
const { errorHandler } = require("../MiddleWares/Error.js");
const Formidable = require("formidable");

const cloudinary = require("cloudinary");
const {
  generateToken,
  generateRefreshToken,
} = require("../utils/generateToken.js");
cloudinary.config({
  cloud_name: "medicalproject",
  api_key: "476736736776691",
  api_secret: "6TiV5eTnGSF8OnPIkyOn7ikyA3E",
});
const User = require("./../Models/UserModel.js");
const userRouter = express.Router();
userRouter.get("/profile", async (req, res) => {
  try{
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
} catch (err) {
  errorHandler(err, req, res);
}
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log(generateRefreshToken(user._id));
      const token = generateToken(user._id);
      res.cookie("/refreshToken", generateRefreshToken(user._id));
      res.status(200).json({
        _id: user._id,
        email: user.email,
        token: token,
        lastName: user.lastName,
        firstName: user.firstName,
        refreshToken: generateRefreshToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});
userRouter.post("/social", async (req, res) => {
  try {
    const { email, password, lastName, firstName, type } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      const token = generateToken(userExists._id);
      res.status(201).json({
        _id: userExists._id,
        email: userExists.email,
        lastName: lastName,
        firstName: firstName,
        token,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const apassword = await bcrypt.hash("123456789", salt);
      const user = await User.create({
        repeat: apassword,
        email,
        password: apassword,
        lastName,
        firstName,
        type,
      });
      if (user) {
        const token = generateToken(user._id);
        res.status(201).json({
          _id: user._id,
          email: user.email,
          lastName: user.lastName,
          firstName: user.firstName,
          token,
        });
      }
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});
// REGISTER
userRouter.post("/", async (req, res) => {
  try {
    const { repeat, email, password, lastName, firstName, type } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.type == "social") {
        const salt = await bcrypt.genSalt(10);
        const apassword = await bcrypt.hash(password, salt);
        const modified = await User.findByIdAndUpdate(userExists._id, {
          $set: { password: apassword, type: "user" },
        });
        if (modified) {
          const token = generateToken(modified._id);
          res.status(201).json({
            _id: modified._id,
            email: modified.email,
            lastName: modified.lastName,
            firstName: modified.firstName,
            token,
            type,
          });
        }
      } else {
        res.status(400);
        throw new Error("User already exists");
      }
    } else {
      const user = await User.create({
        repeat,
        email,
        password,
        lastName,
        firstName,
        type,
      });
      if (user) {
        const token = generateToken(user._id);
        res.status(201).json({
          _id: user._id,
          repeat,
          email: user.email,
          password: user.password,
          lastName: user.lastName,
          firstName: user.firstName,
          token,
        });
        const auth = {
          auth: {
            api_key: "key-70444548fb722dfeec8629dced53d7c4",
            domain: "sandboxa72f45c4c13440ee9480bebdc4166e75.mailgun.org",
          },
        };
        const nodemailerMailgun = nodemailer.createTransport(
          nodemailerTransport(auth)
        );

        nodemailerMailgun.sendMail(
          {
            from: "Medical Project <mailgun@sandboxa72f45c4c13440ee9480bebdc4166e75.mailgun.org>",
            to: user.email,

            subject: "Verify Email Link",

            //You can use "html:" to send HTML email content. It's magic!
            html: `
          <!DOCTYPE html><html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Roboto" 
rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Bitter" rel="stylesheet" 
type="text/css"><link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Roboto+Slab" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Oxygen" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet" type="text/css"><link
 href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Droid+Serif" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Playfair+Display" rel="stylesheet" type="text/css"><link 
href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet" type="text/css"><!--<![endif]--><style>
*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}@media (max-width:700px){.desktop_hide table.icons-inner{display:inline-block!important}.icons-inner{text-align:center}.icons-inner td{margin:0 auto}.fullMobileWidth,.row-content{width:100%!important}.mobile_hide{display:none}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}.reverse{display:table;width:100%}.reverse .column.first{display:table-footer-group!important}.reverse .column.last{display:table-header-group!important}.row-9 td.column.first>table{padding-left:0;padding-right:30px}.row-9 td.column.first .border,.row-9 td.column.last .border{border-top:0;border-right:0;border-bottom:0;border-left:0}.row-9 td.column.last>table{padding-left:40px;padding-right:40px}}
</style></head><body style="background-color:#fafafa;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none"><table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#fafafa"><tbody><tr><td><table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table 
class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:680px" width="680"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:20px;padding-bottom:20px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="icons_block" width="100%" border="0" cellpadding="0" 
cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="vertical-align:middle;color:#000;text-align:center;font-family:inherit;font-size:14px;padding-top:10px"><table cellpadding="0" cellspacing="0" role="presentation" align="center" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="vertical-align:middle;text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px"><img class="icon" 
src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6576/Logo.png" alt height="64" width="104" align="center" style="display:block;height:auto;margin:0 auto;border:0"></td></tr></table></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" 
cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#0076da;color:#000;background-image:url(https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6576/header-bg.jpg);background-repeat:no-repeat;background-position:center top;width:680px" width="680"><tbody><tr><td class="column column-1" width="100%" 
style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-left:50px;padding-right:50px;padding-top:0;padding-bottom:0;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="heading_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="width:100%;text-align:center;padding-top:95px"><h3 
style="margin:0;color:#edeff4;font-size:18px;font-family:Poppins,Arial,Helvetica,sans-serif;line-height:120%;text-align:center;direction:ltr;font-weight:400;letter-spacing:1px;margin-top:0;margin-bottom:0"><span class="tinyMce-placeholder">MAKE A DIFFERENCE</span></h3></td></tr></table><table class="heading_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td 
style="width:100%;text-align:center;padding-bottom:20px"><h1 style="margin:0;color:#000;font-size:38px;font-family:Poppins,Arial,Helvetica,sans-serif;line-height:150%;text-align:center;direction:ltr;font-weight:700;letter-spacing:normal;margin-top:0;margin-bottom:0"><span class="tinyMce-placeholder" style="color: #fcfaf7;">Humanity<br>starts with<br>charity&nbsp;</span></h1></td></tr></table><table class="button_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" 
style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="text-align:center;padding-bottom:70px"><div align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:52px;width:176px;v-text-anchor:middle;" arcsize="58%" stroke="false" fillcolor="#ffd900"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#000000; font-family:Arial, sans-serif; font-size:16px"><![endif]--><div 
style="text-decoration:none;display:inline-block;color:#000;background-color:#ffd900;border-radius:30px;width:auto;border-top:1px solid #ffd900;font-weight:400;border-right:1px solid #ffd900;border-bottom:1px solid #ffd900;border-left:1px solid #ffd900;padding-top:10px;padding-bottom:10px;font-family:Poppins,Arial,Helvetica,sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all">
<span style="padding-left:35px;padding-right:35px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span class="tinyMce-placeholder" style="line-height: 24px;" data-mce-style="line-height: 24px;">DONATE NOW</span></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table 
class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#fff;color:#000;width:680px" width="680"><tbody><tr><td class="column column-1" width="100%" 
style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-left:50px;padding-right:50px;padding-top:40px;padding-bottom:40px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="heading_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="width:100%;text-align:center;padding-top:15px;padding-bottom:10px"><h3 
style="margin:0;color:#0076da;font-size:28px;font-family:Poppins,Arial,Helvetica,sans-serif;line-height:120%;text-align:center;direction:ltr;font-weight:400;letter-spacing:normal;margin-top:0;margin-bottom:0"><span class="tinyMce-placeholder">Ukraine need your help</span></h3></td></tr></table><table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td 
style="padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:10px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" style="font-size:12px;mso-line-height-alt:18px;color:#636363;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:30px"><span class="tinyMce-placeholder" style="font-size:20px;">Lorem ipsum dolor sit amet,<br>consectetuer adipiscing elit.</span></p></div></div></td>
</tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#edeff4;color:#000;width:680px" width="680"><tbody><tr><td class="column column-1" 
width="50%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="width:100%;padding-right:0;padding-left:0"><div align="center" style="line-height:10px"><img class="fullMobileWidth" 
src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6576/img-left_1.png" style="display:block;height:auto;border:0;width:340px;max-width:100%" width="340" alt="Volunteers" title="Volunteers"></div></td></tr></table></td><td class="column column-2" width="50%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-left:40px;padding-right:40px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="text_block" width="100%" 
border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-top:55px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" style="font-size:12px;mso-line-height-alt:18px;color:#000;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><p style="margin:0;font-size:14px;text-align:left;mso-line-height-alt:39px">
<span style="font-size:26px;"><span class="tinyMce-placeholder" style><span class="tinyMce-placeholder" style>How we work</span></span></span></p></div></div></td></tr></table><table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-bottom:15px;padding-top:10px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" 
style="font-size:12px;mso-line-height-alt:18px;color:#636363;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><p style="margin:0;font-size:14px;text-align:left;mso-line-height-alt:24px"><span class="tinyMce-placeholder" style="font-size:16px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span></p></div></div></td></tr></table><table class="text_block" width="100%" border="0" cellpadding="0" 
cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-bottom:55px;padding-top:10px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" style="font-size:12px;mso-line-height-alt:18px;color:#636363;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><p style="margin:0;font-size:14px;text-align:left;mso-line-height-alt:27px">
<span style="font-size:18px;"><strong><span class="tinyMce-placeholder" style="color:#0076da;">JOIN US</span></strong></span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" 
style="mso-table-lspace:0;mso-table-rspace:0;background-color:#fff;color:#000;width:680px" width="680"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-left:50px;padding-right:50px;padding-top:40px;padding-bottom:30px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="heading_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" 
style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="width:100%;text-align:center;padding-top:15px;padding-bottom:10px"><h3 style="margin:0;color:#000;font-size:26px;font-family:Poppins,Arial,Helvetica,sans-serif;line-height:120%;text-align:center;direction:ltr;font-weight:400;letter-spacing:normal;margin-top:0;margin-bottom:0"><strong><span class="tinyMce-placeholder">How to get involved</span></strong></h3></td></tr></table><table class="text_block" width="100%" border="0" 
cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:10px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" style="font-size:12px;mso-line-height-alt:18px;color:#636363;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:30px">
<span class="tinyMce-placeholder" style="font-size:20px;">Lorem ipsum dolor sit amet, consectetuer<br>adipiscing elit.</span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" 
style="mso-table-lspace:0;mso-table-rspace:0;background-color:#0076da;color:#000;width:680px" width="680"><tbody><tr><td class="column column-1" width="50%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-left:20px;padding-right:20px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" 
style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-bottom:35px;padding-left:30px;padding-right:30px;padding-top:35px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" style="font-size:12px;mso-line-height-alt:18px;color:#fff;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><ul style="line-height:1.5;mso-line-height-alt:18px;font-size:17px"><li><span class="tinyMce-placeholder" style="font-size:17px;">Meals</span></li><li>
<span class="tinyMce-placeholder" style="font-size:17px;">Groceries </span></li><li><p style="margin:0;font-size:17px;mso-line-height-alt:25.5px"><span style="font-size:17px;">Medical supplies</span></p></li></ul></div></div></td></tr></table></td><td class="column column-2" width="50%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-left:20px;padding-right:20px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table 
class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-bottom:35px;padding-left:30px;padding-right:30px;padding-top:35px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" style="font-size:12px;mso-line-height-alt:18px;color:#fcfcfc;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><ul 
style="line-height:1.5;mso-line-height-alt:18px;font-size:17px"><li><p style="margin:0">Food and baby items</p></li><li><p style="margin:0;mso-line-height-alt:25.5px"><span class="tinyMce-placeholder" style="font-size:17px;">Clothes</span></p></li><li><span class="tinyMce-placeholder" style="font-size:17px;">Blankets</span></li></ul></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-7" align="center" width="100%" border="0" cellpadding="0" 
cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#edeff4;color:#000;width:680px" width="680"><tbody><tr><td class="column column-1" width="50%" 
style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-left:40px;padding-right:40px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-top:75px;padding-bottom:40px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" 
style="font-size:12px;mso-line-height-alt:18px;color:#0076da;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><p style="margin:0;font-size:14px;text-align:left;mso-line-height-alt:39px"><span style="font-size:26px;"><strong><span class="tinyMce-placeholder" style><span class="tinyMce-placeholder" style><span class="tinyMce-placeholder" style>Let’s take care of the ukrainian people together</span></span></span></strong></span></p></div></div></td></tr></table></td><td 
class="column column-2" width="50%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="width:100%;padding-right:0;padding-left:0"><div align="center" style="line-height:10px"><img class="fullMobileWidth" 
src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6576/img-right_1.png" style="display:block;height:auto;border:0;width:340px;max-width:100%" width="340" alt="Refugee" title="Refugee"></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" 
border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#fff;color:#000;width:680px" width="680"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:50px;padding-bottom:50px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" 
role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="width:100%;padding-right:0;padding-left:0"><div align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6576/icon.png" style="display:block;height:auto;border:0;width:52px;max-width:100%" width="52"></div></td></tr></table><table class="heading_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" 
style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="width:100%;text-align:center;padding-top:35px;padding-bottom:10px"><h3 style="margin:0;color:#000;font-size:25px;font-family:Poppins,Arial,Helvetica,sans-serif;line-height:120%;text-align:center;direction:ltr;font-weight:400;letter-spacing:normal;margin-top:0;margin-bottom:0"><strong><span class="tinyMce-placeholder">We can do so much because of you</span></strong></h3></td></tr></table><table class="text_block" width="100%" 
border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-bottom:30px;padding-left:15px;padding-right:15px;padding-top:10px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" style="font-size:12px;mso-line-height-alt:18px;color:#636363;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:30px">
<span class="tinyMce-placeholder" style="font-size:20px;"><span class="tinyMce-placeholder" style>You can help us by donating<br>to our fundraise.</span></span></p></div></div></td></tr></table><table class="button_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="text-align:center"><div align="center">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:52px;width:214px;v-text-anchor:middle;" arcsize="58%" stroke="false" fillcolor="#0076da"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><div 
style="text-decoration:none;display:inline-block;color:#fff;background-color:#0076da;border-radius:30px;width:auto;border-top:1px solid #0076da;font-weight:400;border-right:1px solid #0076da;border-bottom:1px solid #0076da;border-left:1px solid #0076da;padding-top:10px;padding-bottom:10px;font-family:Poppins,Arial,Helvetica,sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all">
<span style="padding-left:35px;padding-right:35px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span class="tinyMce-placeholder" style="line-height: 24px;" data-mce-style="line-height: 24px;">MAKE A DONATION</span></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table 
class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#edeff4;color:#000;width:680px" width="680"><tbody><tr class="reverse"><td class="column column-1 first" width="50%" 
style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-right:30px;border-top:0;border-right:0;border-bottom:0;border-left:0"><div class="border"><table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="width:100%;padding-right:0;padding-left:0;padding-top:20px"><div align="center" style="line-height:10px"><img class="fullMobileWidth" 
src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6576/hand.png" style="display:block;height:auto;border:0;width:310px;max-width:100%" width="310" alt="Hand" title="Hand"></div></td></tr></table></div></td><td class="column column-2 last" width="50%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-left:40px;padding-right:40px;border-top:0;border-right:0;border-bottom:0;border-left:0"><div class="border"><table class="text_block" 
width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-top:65px"><div style="font-family:sans-serif"><div class="txtTinyMce-wrapper" style="font-size:12px;mso-line-height-alt:18px;color:#000;line-height:1.5;font-family:Poppins,Arial,Helvetica,sans-serif"><p style="margin:0;font-size:14px;text-align:left;mso-line-height-alt:39px">
<span style="font-size:26px;"><strong><span class="tinyMce-placeholder" style><span class="tinyMce-placeholder" style>We Stand with</span></span></strong></span><span style="font-size:26px;background-color:#ffdd00;"><strong><span class="tinyMce-placeholder" style><span class="tinyMce-placeholder" style> <span style="color:#0076da;">Ukraine</span></span></span></strong></span></p></div></div></td></tr></table><table class="button_block" width="100%" border="0" cellpadding="0" cellspacing="0" 
role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="text-align:left;padding-top:20px;padding-bottom:40px">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:46px;width:128px;v-text-anchor:middle;" arcsize="66%" strokeweight="1.5pt" strokecolor="#0076DA" fill="false"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#0076da; font-family:Arial, sans-serif; font-size:16px"><![endif]--><div 
style="text-decoration:none;display:inline-block;color:#0076da;background-color:transparent;border-radius:30px;width:auto;border-top:2px solid #0076da;font-weight:400;border-right:2px solid #0076da;border-bottom:2px solid #0076da;border-left:2px solid #0076da;padding-top:5px;padding-bottom:5px;font-family:Poppins,Arial,Helvetica,sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all">
<span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span class="tinyMce-placeholder" style="line-height: 24px;" data-mce-style="line-height: 24px;">JOIN US</span></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></td></tr></table></div></td></tr></tbody></table></td></tr></tbody></table><table 
class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:680px" width="680"><tbody><tr><td class="column column-1" width="100%" 
style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:20px;padding-bottom:20px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td style="padding-bottom:30px;padding-left:30px;padding-right:30px;padding-top:15px"><div style="font-family:sans-serif"><div 
class="txtTinyMce-wrapper" style="font-size:12px;font-family:Poppins,Arial,Helvetica,sans-serif;mso-line-height-alt:18px;color:#000;line-height:1.5"><p style="margin:0;font-size:10px;text-align:center;mso-line-height-alt:15px"><span style="font-size:10px;">If you have questions regarding your data, please visit our <a href="http://www.example.com" target="_blank" style="text-decoration: underline; color: #0076da;" rel="noopener">Privacy Policy</a> </span></p><p 
style="margin:0;font-size:10px;text-align:center;mso-line-height-alt:15px">
<span style="font-size:10px;"><span style><span style>Want to change how you receive these emails? You can <a href="http://www.example.com" target="_blank" style="text-decoration: underline; color: #0076da;" rel="noopener">update your preferences</a> or <a href="http://www.example.com" target="_blank" style="text-decoration: underline; color: #0076da;" rel="noopener">unsubscribe</a> from this list.&nbsp;</span></span></span></p><p 
style="margin:0;font-size:10px;text-align:center;mso-line-height-alt:15px"><span style="font-size:10px;"><span style>© 2022 Company.&nbsp;</span></span><span style="font-size:10px;"><span style> All Rights Reserved.</span></span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table 
class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:680px" width="680"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:5px;padding-bottom:5px;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="icons_block" width="100%" border="0" cellpadding="0" 
cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="vertical-align:middle;color:#9d9d9d;font-family:inherit;font-size:15px;padding-bottom:5px;padding-top:5px;text-align:center"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td style="vertical-align:middle;text-align:center">
<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]--><!--[if !vml]><!--><table class="icons-inner" style="mso-table-lspace:0;mso-table-rspace:0;display:inline-block;margin-right:-4px;padding-left:0;padding-right:0" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]--><tr><td 
style="vertical-align:middle;text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:6px"><a href="https://www.designedwithbee.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Designed with BEE" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/53601_510656/Signature/bee.png" height="32" width="34" align="center" style="display:block;height:auto;margin:0 auto;border:0"></a></td><td 
style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:15px;color:#9d9d9d;vertical-align:middle;letter-spacing:undefined;text-align:center"><a href="https://www.designedwithbee.com/" target="_blank" style="color: #9d9d9d; text-decoration: none;">Designed with BEE</a></td></tr></table></td></tr></table></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>          <a   href="medicalproject.herokuapp.com/${token}" >medicalproject.herokuapp.com/${token}<a>
<!-- End --></body></html>`,

            //You can use "text:" to send plain-text content. It's oldschool!
            text: "Thank you",
          },
          function (err, info) {
            if (err) {
              console.log("Error: " + err);
            } else {
              console.log(info);
            }
          }
        );
      } else {
        res.status(400);
        throw new Error("Invalid User Data");
      }
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});
// PROFILE
userRouter.get("/profile/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// UPDATE PROFILE
userRouter.put("/profile", async (req, res) => {
  
      try{   
  const user = await User.findById(req.body._id);
  let updated;
  if (user) {
    if (req.body.photo) {
      await cloudinary.v2.uploader.upload(
        `./images/${req.body.photo}`,
        { public_id: `${req.body.photo}` },
        async function (error, result) {
          if (result) {
            console.log(result.url);
            let updated;
            updated = {
              _id: req.body._id,
              firstName: req.body.firstName || user.firstName,
              lastName: req.body.lastName || user.lastName,
              country: req.body.country || user.country,
              region: req.body.region || user.region,
              phone: req.body.phone || user.phone,
              address: req.body.address || user.address,
              photo: result.url,
              msgs:( req?.body?.msgs?.length>3)?([...(user?.msgs),req.body.msgs]):(user.msgs),            };
            const update = await User.findByIdAndUpdate(req.body._id, updated);
            res.json(update);
          }
        }
      );
    } else {
      updated = {
        _id: req.body._id,
        $push: { msgs: req.body.msgs },
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
        country: req.body.country || user.country,
        region: req.body.region || user.region,
        $set:{phone:req.body.phone},
        address: req.body.address || user.address,
      };
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const apassword = await bcrypt.hash(req.body.password, salt);
        updated = { ...updated, password: apassword };
      }
 
      const update = await User.findByIdAndUpdate(req.body._id, updated,
        {
          runValidators: true,
        });
 
      
 

       
 
 

  
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }


          }catch (err  ) {
            console.log(err)
  errorHandler(err, req, res);
}
});

// GET ALL USER ADMIN
userRouter.get("/", protect, admin, async (req, res) => {
  const users = await User.find({});
  res.json(users);
});
userRouter.get("/newaccesstoken", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
});

module.exports = userRouter;
