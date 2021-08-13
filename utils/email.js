const sgMail = require("@sendgrid/mail");

const sendEmailToUser = (user) => {
  try {
    sgMail.setApiKey("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");

  
    const msg = {
      to: "umeesfd96@gmail.com",
      from: "itsmeumer96@gmail.com",
      templateId: "d-2a221ff358d24cd8a9c4bf32af84d5b8",
      dynamic_template_data: {
         userName: user.name,
         
      }
   };

    sgMail
      .send(msg)
      .then((res) => {
        console.log("Email sent" , res);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmailToUser;
