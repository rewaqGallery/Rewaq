const { Resend } = require("resend");
require("dotenv").config();
console.log(process.env.RESEND_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: "Rewaq <noreply@rewaqgallery.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    });
  } catch (error) {
    console.log("Resend Error:", error);
  }
};

module.exports = sendEmail;
