const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateJwtAndsetupCookie = require("../utils/generateJwtAndSetupCookie");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (password.length < 6) {
      throw Error("Password must be at least 6 characters long");
    }

    const user = await User.findOne({ email });
    if (user) {
      throw Error("User already exists!");
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const saveUser = await newUser.save();

      res.json({
        message: "Sinup successful",
        data: saveUser,
        success: true,
        error: false,
      });
    } else {
      throw Error("User information is invalid!");
    }
  } catch (err) {
    res.json({
      success: false,
      error: true,
      message: err.message || err,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password || ""
    );
    if (!isPasswordCorrect) {
      throw Error("Password is incorrect");
    }

    await generateJwtAndsetupCookie(user._id, res);
    res.json({
      message: "Login succesful",
      data: { ...user, password: "" },
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      error: true,
      message: err.message || err,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw Error("User not found");
    }

    res.json({
      message: "User fetched successfully",
      success: true,
      error: false,
      data: user,
    });
  } catch (err) {
    res.json({
      success: false,
      error: true,
      message: err.message || err,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("task_manager_token", "");
    res.json({
      message: "Logout successful",
      data: null,
      success: true,
      error: false,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};
module.exports = { signup, login, getUser, logout };
