const Article = require("../models/Article");

const createArticle = async (article) => {
  return Article.create(article);
};
const allArticles = async (article) => {
  return Article.find()
};

const updateArticle = (id, obj) => {
  return Article.findOneAndUpdate({ _id: id }, { $set: obj }, { new: true });
};

const deleteArticle = (id) => {
  return Article.findOneAndDelete({ _id: id });
};

module.exports = { createArticle, updateArticle, deleteArticle,allArticles };
