const jwt =require( "jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KET);
};
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, "somekey");
};

module.exports= {generateToken, generateRefreshToken};