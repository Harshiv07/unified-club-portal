import mongoose from 'mongoose';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createJWT } from '../services/authenticationService';

export const signup = async (req, res) => {
  let { name, email, password, contact } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(422).json({ errors: [{ user: "email already exists" }] });
    }
    else {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId,
        name,
        email,
        password,
        contact,
        role: 'participant'
      });
      bcrypt.hash(password, 10)
        .then(async hash => {
          newUser.password = hash;
          const savedUser = await newUser.save();
          if (savedUser) {
            res.status(201).json({ user: user })
          }
          else {
            res.status(500);
          }
        })
        .catch(err => {
          console.log('Catch', err.message);
          res.status(500).json({ error: [err.message] });
        })
    }
  }
  catch (err) {
    console.log(err.message);
    res.status(500).json({ error: [err.message] });
  }
}


export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {   
      console.log('User', user);
      const { password: oldPassword } = user; 
      console.log('Password', password);
      console.log('Old Password', user['password']);
      bcrypt.compare(password, user['password'], (err, result) => {
        if (err) {
          console.log('Password does not match', err.message);
          res.status(401).json({ errors: ['Password does not match; Unauthorized'] });
        }
        else {
          let access_token = createJWT(
            user.email,
            user._id,
            3600
          );
          jwt.verify(access_token, 'rushil1999', (err,
            decoded) => {
            if (err) {
              res.status(500).json({ erros: err });
            }
            if (decoded) {
              return res.status(200).json({
                success: true,
                token: access_token,
                message: user
              });
            }
          });
        }
      });
    }
    else {
      res.status(404).json({ errors: ['Could not find entity'] });
    }
  }
  catch (err) {
    res.status(500).json({errors:[err.message]});
  }
}


  // User.findOne({email: email})
  //  .then(user=>{
  //     if(user){
  //        return res.status(422).json({ errors: [{ user: "email already exists" }] });
  //     }else {
  //        const user = new User({
  //          name: name,
  //          email: email,
  //          password: password,
  //        });
  //        bcrypt.genSalt(10, function(err, salt) { bcrypt.hash(password, salt, function(err, hash) {
  //        if (err) throw err;
  //        user.password = hash;
  //        user.save()
  //            .then(response => {
  //               res.status(200).json({
  //                 success: true,
  //                 result: response
  //               })
  //            })
  //            .catch(err => {
  //              res.status(500).json({
  //                 errors: [{ error: err }]
  //              });
  //           });
  //        });
  //     });
  //    }
  // }).catch(err =>{
  //     res.status(500).json({
  //       errors: [{ error: 'Something went wrong' }]
  //     });
  // })
// }