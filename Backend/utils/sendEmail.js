const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: "Rewaq <onboarding@resend.dev>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("Email sent:", data);
  } catch (error) {
    console.log("Resend Error:", error);
  }
};

module.exports = sendEmail;