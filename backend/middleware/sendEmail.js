const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ac27dae6a3455f",
      pass: "4f64ae9e3314c0",
    },
  });

  const mailOptions = {
    from: "38ebdb4f514f5d",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};
