const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const msg = {
    to: options.email,
    from: "rewaqgallery1@gmail.com",
    subject: options.subject,
    text: options.message,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.log("SendGrid Error:", error.response?.body || error);
  }
};

module.exports = sendEmail;