 // Send email with PDFs attached
 const nodemailer = require('nodemailer');
 const fs = require('fs');
 const path = require('path');
 const clearDirectory = require("./clearDirectory.js");

 function sendEmail() {

    const fromEmail = process.env.FROM_EMAIL;
    const toEmail = process.env.FROM_EMAIL;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: fromEmail,
            // You will need an application password to authenticate with Google in order for line 18 to work. Obtain one at the link below and save it to your .env file:
            // https://support.google.com/mail/answer/185833?hl=en#:~:text=Go%20to%20your%20Google%20Account,the%20page%2C%20select%20App%20passwords.
            pass: process.env.GMAIL_APPLICATION_PASSWORD
        }
    });
   
    let mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: 'You have recieved new Sigma exports',
        text: 'Hello! You have received this email because you have requested multiple workbooks as PDF exports from Sigma. Please find the attached PDFs and follow up with your admins for any questions or concerns!',
        attachments: []
    };
   
    fs.readdirSync(path.join(__dirname, '../../PDFs')).forEach(file => {
        mailOptions.attachments.push({
            filename: file,
            path: path.join(__dirname, '../../PDFs', file)
        });
    });
   
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            clearDirectory()
        }
    });
 }

 module.exports = sendEmail;