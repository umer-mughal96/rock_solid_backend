const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletSchema = new Schema(
  {
    
    walletID: {
      type: String,
      required: true,
    },
    userKeychain: {
      type: String,
      required: true,
    },
    backupKeychain: {
      type: String,
      required: true,
    },
    userID : {
      type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    

    

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wallet", WalletSchema);
