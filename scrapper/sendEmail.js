const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'lakshaykamat2048@gmail.com',
    pass: 'jyqi saow lrak sllw', // Use an application-specific password if using Gmail
  },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: 'Lakshay <lakshaykamat2048@gmail.com>',
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

module.exports = sendEmail;
