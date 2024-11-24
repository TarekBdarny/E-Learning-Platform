import nodeMailer from "nodemailer";

const html = `
<h1>Welcome Test Mailer Another one2 With button</h1>

<p>This is a test email from Nodemailer.</p>
<h2>This time with an image</h2>
<img src="cid:downloadImage" >
<button >Clicks</button>
`;

export const testEmail = async () => {
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    // udjo zcfm ghuq jufw

    const info = await transporter.sendMail({
      from: `Test Mailer ${process.env.USER}`,
      to: "tarekbdarny15@gmail.com",
      subject: "Test Email please work",
      text: "This is a test email from Nodemailer.",
      html,
      attachments: [
        {
          filename: "download.png",
          path: "./download.png",
          cid: "downloadImage",
        },
        {
          filename: "download.png",
          path: "./download.png",
        },
      ],
    });
    console.log("Sent mail" + info.messageId);
  } catch (error) {
    console.log(error.message);
  }
};
