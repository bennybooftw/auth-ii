const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./database/dbConfig.js');
const generateToken = require('./functions/generateToken.js');
const protected = require('./functions/protected');
const server = express();
server.use(express.json());
const PORT = 3300;

server.post("/api/register", (req, res) => {
    const credentials = req.body;
    credentials.password = bcrypt.hashSync(credentials.password, 10);
    db("users")
      .insert(credentials)
      .then(ids => {
        const id = ids[0];
        db("users")
          .where({ id })
          .first()
          .then(user => {
            const token = generateToken(user);
            res.status(201).json({ id: user.id, token });
          })
          .catch(err => {
            res.status(500).send(err);
          });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  
   //use credentials in body, create new JWT upon successful login
  server.post("/api/login", (req, res) => {
    const credentials = req.body;
    db("users")
      .where({ username: credentials.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({ token });
          res.send(`Welcome ${user.username}!`);
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  
   //if logged in, return array of users. verify that password is hashed before save
  server.get("/api/users", protected, (req, res) => {
    db("users")
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.send(err);
      });
  });
  
   server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
