const { emailVerifyTkn, resetPwdTkn } = require("../models");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

async function sendUserVerifyEmail(userId, userEmail) {
  try {
    const verifyToken = await emailVerifyTkn.findOne({
      where: {
        [Op.and]: [{ userId: userId }, { expiresAt: { [Op.gt]: Date.now() } }],
      },
    });
    if (!verifyToken) {
      const uniqueString = crypto.randomBytes(32).toString("hex");
      emailVerifyTkn.create({
        verifyTkn: uniqueString,
        userId: userId,
      });
      const url = `${process.env.BASE_URL}/verify/${userId}/${uniqueString}`;
      const html = `<h3>Click <a href=${url} >here</a> to verify your email, this link will expire after one hour</h3>`;
      await sendEmail(userEmail, "Verify your email", html);
    } else {
      const url = `${process.env.BASE_URL}/verify/${userId}/${verifyToken.verifyTkn}`;
      const html = `<h3>Click <a href=${url} >here</a> to verify your email, this link will expire after one hour</h3>`;
      await sendEmail(userEmail, "Verify your email", html);
    }
  } catch (error) {
    return error;
  }
}

async function sendUserResetEmail(userId, userEmail) {
  try {
    const resetToken = await resetPwdTkn.findOne({
      where: {
        [Op.and]: [{ userId: userId }, { expiresAt: { [Op.gt]: Date.now() } }],
      },
    });
    if (!resetToken) {
      const uniqueString = crypto.randomBytes(32).toString("hex");
      resetPwdTkn.create({
        resetTkn: uniqueString,
        userId: userId,
      });
      const url = `${process.env.BASE_URL}/reset-password/${userId}/${uniqueString}`;
      const html = `<h3>Click <a href=${url} >here</a> to reset your password, this link will expire after one hour</h3>`;
      await sendEmail(userEmail, "Reset your password", html);
    } else {
      const url = `${process.env.BASE_URL}/reset-password/${userId}/${resetToken.resetTkn}`;
      const html = `<h3>Click <a href=${url} >here</a> to reset your password, this link will expire after one hour</h3>`;
      await sendEmail(userEmail, "Reset your password", html);
    }
  } catch (error) {
    return error;
  }
}

async function sendEmail(email, subject, html) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAL_PORT),
      secure: Boolean(process.env.SECURE),
      logger: Boolean(process.env.LOGGER),
      debug: Boolean(process.env.DEBUG),
      secureConnection: Boolean(process.env.SECURE_CONNECTION),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: html,
    });
    console.log("email sent");
  } catch (error) {
    console.log("email not sent ", error);
    return error;
  }
}

module.exports = { sendUserVerifyEmail, sendUserResetEmail };
