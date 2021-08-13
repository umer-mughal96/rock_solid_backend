const jwt = require('jsonwebtoken');

const generateToken = async (payload, req, res) => {
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 360000,
    });
    return token;
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = generateToken;
