require('dotenv').config();
const nodemailer = require("nodemailer");
const conn = require("../db/connection");

const emailSender = "lamanima0122@gmail.com";
const emailPassword = "cnja dtyo mjoe hjlf";

let storedToken = null;

// Route handler to check the token
const checkToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  if (storedToken && storedToken.toString() === token.toString()) {
    return res.status(200).json({ message: "Token verified successfully" });
  } else {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const sendTokenByEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: emailSender,
      pass: emailPassword,
    },
    tls: {
      rejectUnauthorized: false, // Bypass for self-signed certs in dev
    },
  });

  const mailOptions = {
    from: emailSender,
    to: email,
    subject: "Signup Token",
    text: `Your signup token is: ${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    console.log(token)
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const verify = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    storedToken = Math.floor(100000 + Math.random() * 900000);
    await sendTokenByEmail(email, storedToken);
    res.status(200).send("Token sent successfully");
  } catch (error) {
    console.error("Error sending token:", error);
    res.status(500).send("Error sending token");
  }
};

module.exports = { verify, checkToken };
