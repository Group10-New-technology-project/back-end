const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  //signup
  signup: async (req, res) => {
    const { username, password, name } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const newUser = new User({
        username: username,
        password: hashedPassword,
        avatar: "",
        coveravatar: "",
        dateofbirth: "",
        gender: "",
        name: name,
        phoneBook: [],
        friends: [],
        friendRequest: [],
        isActive: true,
        isAdmin: false,
        isDelete: false,
      });
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  //   //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Incorrect username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json("Incorrect password");
      }
      if (user && validPassword) {
        //Generate access token
        const accessToken = authController.generateAccessToken(user);
        // hidden password
        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //   requestRefreshToken: async (req, res) => {
  //     //Take refresh token from user
  //     const refreshToken = req.cookies.refreshToken;
  //     //Send error if token is not valid
  //     if (!refreshToken) return res.status(401).json("You're not authenticated");
  //     jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
  //       if (err) {
  //         console.log(err);
  //       }
  //       refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  //       //create new access token, refresh token and send to user
  //       const newAccessToken = authController.generateAccessToken(user);
  //       const newRefreshToken = authController.generateRefreshToken(user);
  //       refreshTokens.push(newRefreshToken);
  //       res.cookie("refreshToken", refreshToken, {
  //         httpOnly: true,
  //         secure: false,
  //         path: "/",
  //         sameSite: "strict",
  //       });
  //       res.status(200).json({
  //         accessToken: newAccessToken,
  //         refreshToken: newRefreshToken,
  //       });
  //     });
  //   },

  //   //LOG OUT
  //   logOut: async (req, res) => {
  //     //Clear cookies when user logs out
  //     res.clearCookie("refreshToken");
  //     res.status(200).json("Logged out successfully!");
  //   },
};

module.exports = authController;
