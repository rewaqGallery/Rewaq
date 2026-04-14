const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: "Rewaq <noreply@rewaqgallery.com>",
      to: options.email,
      subject: options.subject,

      html: `
        <div style="font-family: Arial, sans-serif; background-color:#cdc2ae; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
            
            <div style="background:#274760; padding:20px; text-align:center;">
              <img src="https://rewaqgallery.com/Logo.png" alt="Rewaq" style="width:120px;" />
            </div>

            <div style="padding:30px; color:#333;">
              <h2 style="margin-bottom:20px;">Hello ${options.name || "there"}!</h2>
              
              <p style="font-size:16px; line-height:1.6;   white-space: pre-line;">
                ${options.message}
              </p>

              <div style="margin-top:30px; text-align:center;">
                <a href="https://rewaqgallery.com" 
                   style="background:#274760; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px;">
                  Visit Website
                </a>
              </div>
            </div>

            <div style="background:#ece5c8; padding:15px; text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Rewaq Gallery. All rights reserved.
            </div>

          </div>
        </div>
      `,
    });

    return data;
  } catch (error) {
    console.log("Resend Error:", error);
  }
};

module.exports = sendEmail;
