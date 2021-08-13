const userServices = require("../../services/user");
const articleServices = require("../../services/article");
const { getIO } = require("../../socket");
const { connectedUsers } = require("../../utils/users");
const ExchangeName = require('../../models/ExNames')

const getAllUsers = async (req, res, next) => {
  try {
    let users = await userServices.getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const editUser = async (req, res, next) => {
  try {
    let id = req.params.user_id;
    let user = await userServices.getUserById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: true, msg: "That User Not Found" });
    }

    let object = {
      lastName: "asdasdasds",
    };

    let updatedUser = await userServices.updateUser(id, object);

    return res.status(200).json({ success: true, updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let id = req.params.user_id;
    await userServices.deleteUser(id);
    return res.status(200).json({ success: true, msg: "Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deActivateUser = async (req, res, next) => {
  try {
    let id = req.params.user_id;
    let updatedObject = {
      active: false,
    };
    await userServices.updateUser(id, updatedObject);
    let findUser = connectedUsers.find((user) => user.id == id);
    if (findUser) {
      getIO()
        .to(findUser.socketId)
        .emit("deactivate", { msg: "Your Account Deactivated" });
    }

    return res
      .status(200)
      .json({ success: true, msg: "Successfully Deactivate User" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const activateUser = async (req, res, next) => {
  try {
    let id = req.params.user_id;
    let updatedObject = {
      active: true,
    };
    await userServices.updateUser(id, updatedObject);
    return res
      .status(200)
      .json({ success: true, msg: "Successfully Activate User" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const createArticle = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    let article = await articleServices.createArticle(req.body);

    return res.status(200).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllArticles = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    let articles = await articleServices.allArticles();

    return res
      .status(200)
      .json({ success: true, count: articles.length, articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateArticle = async (req, res, next) => {
  try {
    let id = req.params.article_id;
    let article = await articleServices.updateArticle(id, req.body);

    return res.status(200).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    let id = req.params.article_id;
    await articleServices.deleteArticle(id);

    return res.status(200).json({ success: true, msg: "Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getPackages = async (req, res, next) => {
  try {
    let pacakges = await userServices.getPackagesDetail();

    return res.status(200).json({ success: true, pacakges });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const getExchanges = async (req, res, next) => {
  try {

    let exchangeNames = await ExchangeName.find()

    return res.status(200).json({ success: true, exchangeNames });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



const createExchanges = async (req, res, next) => {
  try {

    let exchangeNames = await ExchangeName.find()

    exchangeNames[0].exchangeName.push(req.body);
    console.log(exchangeNames)

    await exchangeNames[0].save();

    return res.status(200).json({ success: true, msg: "Suceessfully add Exchange" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



const inActiveExchange = async (req, res, next) => {
  try {

    let exchangeNames = await ExchangeName.find()

    let exchange = exchangeNames[0].exchangeName.find((ex) => ex._id == req.body.id)

    if (exchange.active == true) {

      exchange.active = false;
      console.log(exchangeNames[0].exchangeName)
      await exchangeNames[0].save();

      return res.status(200).json({ success: true, msg: "Suceessfully InActive Exchange" });

    } else if (exchange.active == false) {
      exchange.active = true;
      await exchangeNames[0].save();

      return res.status(200).json({ success: true, msg: "Suceessfully Active Exchange" });
    }else{

      return res.status(400).json({ success: true, msg: "Something Wrong" });
    }

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllUsers,
  editUser,
  deleteUser,
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getPackages,
  deActivateUser,
  activateUser,
  createExchanges,
  inActiveExchange,
  getExchanges
};
