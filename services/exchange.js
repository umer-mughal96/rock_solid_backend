const Exchange = require("../models/Exchange");

const createExchange = async (exchangeObj) => {
  try {
    return Exchange.create(exchangeObj);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 10 ~ createExchange ~ error",
      error
    );
  }
};

const getExchange = async (userId) => {
  try {
    return Exchange.findOne({ userId })
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 10 ~ createExchange ~ error",
      error
    );
  }
};


const getAllExchangesWithKeys = async (userId) => {
  try {
    return Exchange.findOne({ userId })
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 10 ~ createExchange ~ error",
      error
    );
  }
};

const deleteExchange = async (id, exchangeId) => {
  try {
    return await Exchange.findByIdAndUpdate(
      id,
      {
        $pull: {
          exchanges: {
            _id: exchangeId,
          },
        },
      },
      { safe: true, upsert: true }
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 10 ~ createExchange ~ error",
      error
    );
  }
};

module.exports = { createExchange, getExchange, deleteExchange,getAllExchangesWithKeys };
