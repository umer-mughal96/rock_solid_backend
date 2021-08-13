const User = require('../models/User');

const updateUser = async (id,user) => {
  return User.updateOne(
    { _id: id },
    {
      $set: user,
    }
  );
};


module.exports = {updateUser}