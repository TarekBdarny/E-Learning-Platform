import nodeMailer from "nodemailer";
import {
  greetingEmailHtml,
  urgentEmailHtml,
  verificationEmailHtml,
} from "./emailTemplate.js";

export const mailer = async (recipientEmail, type, data = "") => {
  console.log(recipientEmail);
  console.log(type);
  const companyName = "E-Learning Platform";
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail", // the email service your email that you want to send emails from
      host: "smtp.gmail.com", // static host for the gmail server
      port: 587, // default port for false secure/ if the secure is true the port will be 465
      secure: false, // your choice of secure true of false
      auth: {
        // object that contain the email address and password for the email you want to send emails from
        user: process.env.USER, // this should be private and no one should see this information (email address)
        pass: process.env.PASS, // this should be private and no one should see this information (email password)
        // can also use gmail temp password type in google account (app passwords and create new one)
      },
    });
    let html =
      type === "greeting"
        ? greetingEmailHtml.replace("{fullname}", data)
        : type === "verification"
        ? verificationEmailHtml.replace("{verificationToken}", data)
        : urgentEmailHtml;

    let subject =
      type === "greeting"
        ? `Welcome to ${companyName}`
        : type === "verification"
        ? `Please verify you'r created email by entering the 6 digits in the mail box in the website.`
        : "URGENT";
    const info = await transporter.sendMail({
      from: `E-Learning Platform ${process.env.USER}`, // who sent the email and mail title before opening the mail
      to: recipientEmail, // the account you want to send emails
      subject,
      html,
      // htmlOptions for the mail you can send images buttons full html format
    });

    console.log("Sent mail" + info.messageId); // console to see if the mail got sent
  } catch (error) {
    console.log(error.message); // console any error the occurred in the process
  }
};
