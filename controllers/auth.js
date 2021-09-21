const generateToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
const Token = require("../models/Token");
const BitGoJS = require('bitgo');
// Read the user authentication section to get your API access token




// const { OAuth2Client } = require("google-auth-library");
const User = require('../models/User')
const Wallet = require('../models/Wallet')
// const client = new OAuth2Client(
//   "577210671376-f8jma6jbeh2ise31rgp23jv42hfmbpgg.apps.googleusercontent.com"
// );
const dayjs = require('dayjs');
const sendEmailToUser = require("../utils/email");
//POST        @REGISTER USER
//API         @  '/register '

const registerUser = async (req, res, next) => {
  let abc = '';
  let def= '';
  let userkey= '';
  let backupKey = '';
  let wallet_id ;
 

  console.log("Access token : "+process.env.ACCESS_TOKEN);
  
  

 // Original code
  console.log("This is in");
  try {
    const { email, password, name } = req.body;
    let findUser = await User.findOne({ email });

    if (findUser) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already exist"   });
    }

    const salt = await bcrypt.genSalt(10);
    // req.body.password = await bcrypt.hash(password, salt);
    const pass = await bcrypt.hash(password, salt)
    
    

    //Wallet creation Code
    const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.ACCESS_TOKEN });

    const walletPassword = process.env.wallet_Pass;

    await bitgo.wallets().createWalletWithKeychains({"passphrase": walletPassword, "label": "Test wallet test 1"}, async function(err, result) {
    if (err) { console.dir(err); throw new Error("Error creating wallet!"); }
    // console.log("Wallet Created: " + result.wallet.id());
    // console.log(result.wallet.wallet);
    console.log("variables initialized etc")
    wallet_id = await result.wallet.id() ;
    abc = await result.userKeychain.encryptedXprv ; 
    def = await result.userKeychain.encryptedXprv;
    userkey = await bcrypt.hash(abc, salt); 
    backupKey =  await bcrypt.hash(def, salt);
  // console.log("BACK THIS UP: ");                                                                                                                                                  
  // console.log("User keychain encrypted xPrv: " + result.userKeychain.encryptedXprv);                                                                                              
  // console.log("Backup keychain encrypted xPrv: " + result.backupKeychain.encryptedXprv);                                                                                          
  });

  await bitgo.coin('tbtc').wallets()
.generateWallet({ label: 'My Test Wallet 123', passphrase: walletPassword })
.then(async function(result) {
  // print the new wallet
  // console.log(wallet.wallet);
  wallet_id = await result.wallet.id() ;
    abc = await result.userKeychain.prv ; 
    def = await result.backupKeychain.prv;
    // ghi = await result.bitgoKeychain.prv;
    userkey = await bcrypt.hash(abc, salt); 
    backupKey =  await bcrypt.hash(def, salt);
//   wallet.createAddress({ label: 'My address' })
// .then(function(address) {
//   // print new address
//   console.log("This is address : ");
//   console.log(address);
// });
});


 


   //Wallet creation code ends here

  const userCreation = await User.create({
    name : name, 
    email : email, 
    password : pass, 
    verified : true
   
  });
  // // console.log(userCreation.id);
  // // console.log(wallet_id);

  const walletCreation = await Wallet.create({
    walletID : wallet_id,
    userKeychain : userkey,
    backupKeychain :  backupKey,
    userID : userCreation.id
  })

   
    // await sendEmailToUser({ name: req.body.name , email : req.body.email });

    res.status(201).json({ success: true, msg: "Successfully registered!" });
  } catch (err) {
    console.log("This is error : "+err);
    res.status(500).json({ success: false, error: err.message });
  }

  // Original code ends here
};

//POST        @LOGIN USER
//API         @  '/signin'

const userLogin = async (req, res, next) => {
  console.log("In login");
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Not found");
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
        // role: user.role,
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
