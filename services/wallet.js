const User = require("../models/Wallet");

const getWalletID = (id) => {
    const walletData = await Wallet.findOne({userID : id}, {walletID:1});
    // console.log("This is wallet data : "+walletData.walletID);
    return walletData.walletID;
};

// const getAllConditionalUsers = (condition) => {
//   return User.find(condition).select("-password");
// };

// const getAllUsers = () => {
//   return User.find().select("-password");
// };

// const updateUser = (id, obj) => {
//   return User.findOneAndUpdate({ _id: id }, { $set: obj }, { new: true });
// };

// const deleteUser = (id, obj) => {
//   return User.findOneAndDelete({ _id: id });
// };

// const getPackagesDetail = () => {
//   return User.find().select("package");
// };



module.exports = {
  getWalletID,
  
};
