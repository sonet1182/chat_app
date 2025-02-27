import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "User Unauthorized" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if(!decode) {
      return res.status(401).json({ message: "User Unauthorized - Invalid Token" });
    }
    const user = await User.findById(decode.userId).select("-password");
    if(!user) {
      return res.status(401).json({ message: "User not found!" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).send({ message: error.message });
  }
};

export default isLogin;
