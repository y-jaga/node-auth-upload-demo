const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log({ username, email, password, role });

    const existUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existUser) {
      return res
        .status(400)
        .json({ error: "user with same username or email already exists." });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: userObj,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      mesage: "Something went wrong",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const autheticatedUser = await user.comparePassword(password);

    if (!autheticatedUser) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      },
    );

    res.status(201).json({
      success: true,
      message: "User logged-in successfully.",
      jwtToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      mesage: "Something went wrong",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    //password validation
    if (!oldPassword || oldPassword.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "old password is required." });
    }
    if (!newPassword || newPassword.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "new password is required." });
    }

    if (oldPassword == newPassword) {
      return res.status(400).json({
        success: false,
        error: "new password and old password can't be same.",
      });
    }

    //confirm old password with logged-in user password
    const user = await User.findOne({ _id: userId }).select("+password");
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found.",
      });
    }
    const authenticatedUser = await user.comparePassword(oldPassword);
    if (!authenticatedUser) {
      return res.status(400).json({
        success: false,
        error: "Wrong old password.",
      });
    }

    //change the password
    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      mesage: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, changePassword };
