const exchangeSevices = require("../services/exchange");
const { default: axios } = require("axios");
const crypto = require("crypto");
const stripeClient = require("stripe")(
  "sk_test_51IyeYHAk9CJdz6j4sVXOtfaGM5sBCHcHY0ybvPWfnQZUploDADT8Y9wwP9G1EgMq80G0uC0VorY76ldxgJut9Wp100ZW8KYDjM"
);
const { stringify } = require("flatted");
const binanceServices = require('../apiServices/binance')
const bitpandaServices = require('../apiServices/bitpandapro')
const poloniexServices = require('../apiServices/poloniex')
const krakenServices = require('../apiServices/kraken')
const okexServices = require('../apiServices/okex')

//Update User By Id

const stripePayment = async (req, res, next) => {
  try {
    const { id, price } = req.body;
    const response = await stripeClient.paymentIntents.create({
      amount: price * 100,
      currency: "USD",
      description: "Crypto",
      payment_method: id,
      confirm: true,
    });
    console.log(
      "🚀 ~ file: user.js ~ line 142 ~ stripePayment ~ response",
      response
    );
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log("🚀 ~ file: user.js ~ line 145 ~ stripePayment ~ err", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getExchangesDataOfSpecificExchange = async (req, res, next) => {
  try {
    let getExchanges = await exchangeSevices.getAllExchangesWithKeys(req.user.id);

    if (!getExchanges) {
      return res
        .status(400)
        .json({ success: false, msg: "Exchange Bad Request" });
    }
    let findExchange = getExchanges.exchanges.find(
      (ex) => ex.exchangeName == req.query.name
    );

    if (req.query.name == "Binance") {
      let serverTime = await axios.get(`${process.env.BINANCE_BASE_URL}/api/v3/time`) //GET SERVER TIMESTAMP

      let data = await binanceServices.getBinanceAssets(serverTime.data.serverTime, findExchange.apiKey, findExchange.secretKey)

      let jsonData = stringify(data);
      return res.status(200).json({ success: true, data: jsonData })
    } else if (req.query.name == "Bitpanda pro") {
      let response = await bitpandaServices.getBitpandaAssets(findExchange.apiKey)
      return res.status(200).json({ success: true, data: response.data })
    } else if (req.query.name == "Poloniex") {
      let response = await poloniexServices.getPloniexAssets(findExchange.apiKey, findExchange.secretKey)

      return res.status(200).json({ success: true, data: response })
    }
    else if (req.query.name == "Kreken") {
      let response = await krakenServices.getKrakenAssets(findExchange.apiKey, findExchange.secretKey)

      return res.status(200).json({ success: true, data: response })
    } else if (req.query.name == "Okex") {
      let response = await okexServices.getOkexAssets(findExchange.apiKey, findExchange.secretKey)

      return res.status(200).json({ success: true, data: response })
    }




    res.status(400).json({ success: true, msg: "No Exchange Found" });
  } catch (err) {
    console.log(
      "🚀 ~ file: user.js ~ line 72 ~ getExchangesDataOfSpecificExchange ~ err",
      err
    );
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getExchangesDataOfSpecificExchange,
  stripePayment,
};
