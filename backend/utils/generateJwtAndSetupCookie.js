const jwt = require("jsonwebtoken");
const generateJwtAndsetupCookie = (userId, res) => {
  try {
    const jwtToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    res.cookie("task_manager_token", jwtToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  } catch (err) {
    res.json({
      messgae: err.messgae || err,
      success: false,
      error: true,
    });
  }
};

module.exports = generateJwtAndsetupCookie;
