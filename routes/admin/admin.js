const express = require("express");
const {
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
} = require("../../controllers/admin/admin");
const { authenticated } = require("../../middleware/auth");
const { isAdminOrUser,isAdmin } = require("../../middleware/roles");
const router = express.Router();

router.get("/users", authenticated, isAdmin, getAllUsers);

router.patch("/edit/user/:user_id", authenticated, isAdmin, editUser);
router.delete("/delete/user/:user_id", authenticated, isAdmin, deleteUser);
router.patch("/deactivate/user/:user_id", authenticated, isAdmin, deActivateUser);
router.patch("/activate/user/:user_id", authenticated, isAdmin, activateUser);

router.post("/create/article", authenticated, isAdmin, createArticle);

router.get("/articles", authenticated, isAdmin, getAllArticles);

router.patch(
  "/edit/article/:article_id",
  authenticated,
  isAdmin,
  updateArticle
);
router.delete(
  "/delete/article/:article_id",
  authenticated,
  isAdmin,
  deleteArticle
);





router.get("/packages", authenticated, isAdmin, getPackages);



router.get("/exchangenames", authenticated, isAdminOrUser, getExchanges);
router.post("/create/exchangename", authenticated, isAdmin, createExchanges);
router.patch("/acintive/exchangename", authenticated, isAdmin, inActiveExchange);

module.exports = router;
