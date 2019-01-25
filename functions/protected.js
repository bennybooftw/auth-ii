const jwt = require('jsonwebtoken');

const protected = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          res.status(401).json({ message: "Invalid token" });
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } else {
      res.status(401).json({ message: "No token provided." });
    }
  };

   module.exports = protected; 
