const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const connectDB = require("./config/db");
const cookie = require('cookie-parser')



const authRoute = require('./routes/auth')
const walletRoute = require('./routes/wallet')





const app = express();
app.use(morgan("dev"));
app.use(cookie())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ extended: false }));
dotenv.config({ path: "config/config.env" });

connectDB();


// for(let i = 0 ; i < 5 ; i++){
//   setTimeout(() => {
//     console.log(i)
//   },1000)
// }



app.use('/rocksolid/api/v1/auth', authRoute)
app.use('/rocksolid/api/v1/wallet', walletRoute);






const PORT = process.env.PORT || 9000;



app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
});




