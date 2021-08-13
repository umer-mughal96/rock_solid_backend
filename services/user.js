const User = require("../models/User");

const getUserById = (id) => {
  return User.findOne({ _id: id }).select("-password");
};

const getAllConditionalUsers = (condition) => {
  return User.find(condition).select("-password");
};

const getAllUsers = () => {
  return User.find().select("-password");
};

const updateUser = (id, obj) => {
  return User.findOneAndUpdate({ _id: id }, { $set: obj }, { new: true });
};

const deleteUser = (id, obj) => {
  return User.findOneAndDelete({ _id: id });
};

const getPackagesDetail = () => {
  return User.find().select("package");
};

module.exports = {
  getUserById,
  getAllConditionalUsers,
  getAllUsers,
  updateUser,
  deleteUser,
  getPackagesDetail,
};
