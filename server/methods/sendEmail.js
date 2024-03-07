 // Send email with PDFs attached
 const nodemailer = require('nodemailer');
 const fs = require('fs');
 const path = require('path');
 const clearDirectory = require("./clearDirectory.js");

 function sendEmail() {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'curtistest652@gmail.com',
            pass: 'mijh egnw fzdn etqc'
        }
    });
   
    let mailOptions = {
        from: 'curtistest652@gmail.com',
        to: 'curtistest652@gmail.com',
        subject: 'Multiple Workbook PDF Exports Attached to One Email',
        text: 'Hey Lindsey, hope this message finds you well! Please find the attached PDFs and let me know whether or not this is what you had in mind!',
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