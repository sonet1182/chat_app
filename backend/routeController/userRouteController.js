import express from "express";
import User from "../Models/userModels.js";
import bcrypt from "bcryptjs";
import jwtToken from "../utils/jwtToken.js";

export const userRegister = async (req, res) => {
  try {
    console.log("auth router working");
    const { username, fullname, email, gender, password, profilepic } =
      req.body;
    const user = await User.findOne({ username, email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hashPassword = bcrypt.hashSync(password, 10);
      const profileBoy = profilepic
        ? profilepic
        : `https://avatar.iran.liara.run/public/boy?username=${username}`;
      const profileGirl = profilepic
        ? profilepic
        : `https://avatar.iran.liara.run/public/girl?username=${username}`;

      const newUser = new User({
        username,
        fullname,
        email,
        password: hashPassword,
        gender,
        profilepic: gender === "male" ? profileBoy : profileGirl,
      });

      if (newUser) {
        await newUser.save();
        jwtToken(newUser._id, res);
        res.status(201).json({
          message: "User registered successfully",
          data: {
            _id: newUser._id,
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            profilepic: newUser.profilepic,
          },
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).send({ message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "User doesn't exists" });
    } else {
      const comparePassword = bcrypt.compareSync(password, user.password || "");
      if (!comparePassword)
        return res.status(400).json({ message: "Invalid password" });

      jwtToken(user._id, res);

      res.status(200).json({
        message: "User logged in successfully",
        data: {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          profilepic: user.profilepic,
          message: "Successfully Login"
        },
      });
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).send({ message: error.message });
  }
};

export const userLogOut = async (req, res) => {
    try {
      res.cookie("jwt", "", {
        maxAge: 0
      });
      res.status(200).send({ message: "User Logout" });
    } catch (error) {
      console.error(`Error: ${error}`);
      res.status(500).send({ message: error.message });
    }
  };
  
