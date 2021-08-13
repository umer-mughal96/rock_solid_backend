const generateToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
const Token = require("../models/Token");
const { OAuth2Client } = require("google-auth-library");
const User = require('../models/User')
const client = new OAuth2Client(
  "577210671376-f8jma6jbeh2ise31rgp23jv42hfmbpgg.apps.googleusercontent.com"
);
const dayjs = require('dayjs');
const sendEmailToUser = require("../utils/email");
//POST        @REGISTER USER
//API         @  '/register '

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let findUser = await User.findOne({ email });
    // if (findUser) {
    //   return res
    //     .status(400)
    //     .json({ success: false, msg: "Email already exist" });
    // }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
    await User.create(req.body)
    await sendEmailToUser({ name: req.body.firstName , email : req.body.email });

    res.status(201).json({ success: true, msg: "Successfully registered!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

//POST        @LOGIN USER
//API         @  '/signin'

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid Credentials !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    const token = await generateToken(payload);
    const loginUser = await User.findOne({ email }).select("-password");

    res.cookie('token', token, { expires: dayjs().add(1, "days").toDate(), httpOnly: true }).status(200).json({ success: true, loginUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//POST        @FORGOT PASSWORD
//API         @  '/forgotpassword'

const forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid Email !" });
    }

    let forgetCode = randomstring.generate({
      length: 6,
      charset: "numeric",
    });
    let userToken = new Token({
      userId: user.id,
      token: forgetCode,
    });
    await sendEmailToUser(user, forgetCode);
    await userToken.save();
    res.status(200).json({ success: true, msg: "Send link to your email" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//POST        @VERIFY TOKEN
//API         @  '/verify'

const verifyToken = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token) {
      return res
        .status(404)
        .json({ success: false, msg: "Provide Your Token" });
    }
    const tokenUser = await Token.findOne({ token });

    if (!tokenUser) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid Verify Code!" });
    }
    const user = await User.findOne({ _id: tokenUser.userId }).select(
      "-password"
    );
    console.log("🚀 ~ file: auth.js ~ line 166 ~ verifyToken ~ user", user);

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid User!" });
    }

    if (!password) {
      return res
        .status(404)
        .json({ success: false, msg: "Provide Password Filed!" });
    }

    const salt = await bcrypt.genSalt(10);
    let newHashedPassword = await bcrypt.hash(password, salt);
    let updateUserWithNewPassword = { password: newHashedPassword };
    let updateUser = await authServices.updateUser(
      user.id,
      updateUserWithNewPassword
    );
    // await user.save();
    res.status(200).json({ success: true, updateUser, msg: "You Verified !" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




const status = async (req, res, next) => {
  try {

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token").status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


module.exports = {
  registerUser,
  userLogin,
  forgotPassword,
  verifyToken,
  status,
  logout
};
