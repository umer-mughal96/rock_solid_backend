const generateToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
// const Token = require("../models/Token");
const BitGoJS = require('bitgo');
const {getWalletID} = require('../services/wallet')
// Read the user authentication section to get your API access token



// const { OAuth2Client } = require("google-auth-library");
const User = require('../models/User')
const Wallet = require('../models/Wallet')

const dayjs = require('dayjs');
const sendEmailToUser = require("../utils/email");

//POST        @Get balance
//API         @  '/getbalance '

const getBalance = async (req, res, next) => {
    let balance = '';

 

  console.log("Access token : "+process.env.ACCESS_TOKEN);
  
  

 // Original code
  console.log("This is in");
  const useriD = req.user.id;
  console.log("This is UserID"+useriD);
  try {
    
    const user = User.findById({useriD});
    if (!user) {
        console.log("Not found");
        return res
          .status(404)
          .json({ success: false, msg: "Invalid User !" });
      }
      const walletData = await Wallet.findOne({userID : useriD}, {walletID:1});
      console.log("This is wallet data : "+walletData.walletID);

      if (!walletData) {
        console.log("wallet Not found");
        return res
          .status(404)
          .json({ success: false, msg: "Wallet not found !" });
      }


    

    //Wallet creation Code
    const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.ACCESS_TOKEN });

    const walletPassword = process.env.wallet_Pass;
    // const address =  
//    await bitgo.wallets().get({type: 'bitcoin', id: walletData.walletID},async (error, wallet)=>{
//     console.log(wallet.balance() + ' Satoshis');
//     balance = await wallet.balance();
//    });
       
   //Wallet creation code ends here

    // let walletId = '585c51a5df8380e0e3082e46';
    await bitgo.coin('tbtc').wallets().get({ id: walletData.walletID })
    .then(function(wallet) {
    // print the wallet
    console.dir(wallet._wallet.balance);
    balance = wallet._wallet.balance;
    });


   
    // await sendEmailToUser({ name: req.body.name , email : req.body.email });

    res.status(200).json({ success: true, balance:balance });
  } catch (err) {
    console.log("This is error : "+err);
    res.status(500).json({ success: false, error: err.message });
  }

  // Original code ends here
};

//POST        @Send Coin
//API         @  '/sendcoin'

const sendCoin = async (req, res, next) => {
  console.log("Send coin");

  const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.ACCESS_TOKEN });
  const useriD = req.user.id; // User ID from Cookies

  getWalletID(useriD);

  const wallet = await bitgo.coin('tbtc').wallets().get({ id: walletData.walletID });
    
    // // print the wallet
    // console.dir(wallet._wallet.balance);
    // balance = wallet._wallet.balance;
    // });

//   res.sendStatus(200);










//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("Not found");
//       return res
//         .status(404)
//         .json({ success: false, msg: "Invalid Credentials !" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "Invalid Credentials" });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         email: user.email,
//         // role: user.role,
//       },
//     };

//     const token = await generateToken(payload);
//     const loginUser = await User.findOne({ email }).select("-password");

//     res.cookie('token', token, { expires: dayjs().add(1, "days").toDate(), httpOnly: true }).status(200).json({ success: true, loginUser });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
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
  getBalance,
  sendCoin,
  forgotPassword,
  verifyToken,
  status,
  logout
};
