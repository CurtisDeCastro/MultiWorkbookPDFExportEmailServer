 // Send email with PDFs attached, compatible with emailOptions sample and robust logging
 const nodemailer = require('nodemailer');
 const fs = require('fs');
 const path = require('path');
 const clearDirectory = require("./clearDirectory.js");

 function sendEmail(emailOptions) {
    try {
        // emailOptions is expected to be an object like:
        // {
        //   send_to: [ 'curtis@sigmacomputing.com' ],
        //   subject: 'My Custom Subject',
        //   text: 'This is a test of some dynamic content in the email body'
        // }
        if (!emailOptions || typeof emailOptions !== 'object') {
            console.error('[sendEmail] Invalid emailOptions provided:', emailOptions);
            return;
        }

        const fromEmail = process.env.FROM_EMAIL;
        if (!fromEmail) {
            console.error('[sendEmail] FROM_EMAIL environment variable is not set.');
            return;
        }

        // Validate recipients
        let toEmails;
        if (Array.isArray(emailOptions.send_to) && emailOptions.send_to.length > 0) {
            toEmails = emailOptions.send_to.join(',');
        } else {
            console.warn('[sendEmail] No valid send_to array found in emailOptions. Defaulting to FROM_EMAIL.');
            toEmails = fromEmail;
        }

        const subject = emailOptions.subject || 'Sigma PDF Export';
        const text = emailOptions.text || 'Hello! You have received this email because you have requested multiple workbooks as PDF exports from Sigma. Please find the attached PDFs and follow up with your admins for any questions or concerns!';

        console.log(`[sendEmail] Preparing to send email from: ${fromEmail} to: ${toEmails}`);
        console.log(`[sendEmail] Subject: ${subject}`);
        console.log(`[sendEmail] Text: ${text}`);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: fromEmail,
                pass: process.env.GMAIL_APPLICATION_PASSWORD
            }
        });

        // Gather PDF attachments
        const pdfDir = path.join(__dirname, '../../PDFs');
        let attachments = [];
        try {
            if (!fs.existsSync(pdfDir)) {
                console.error(`[sendEmail] PDF directory does not exist: ${pdfDir}`);
            } else {
                const files = fs.readdirSync(pdfDir);
                if (files.length === 0) {
                    console.warn('[sendEmail] No PDF files found to attach.');
                }
                files.forEach(file => {
                    const filePath = path.join(pdfDir, file);
                    // Only attach files with .pdf extension
                    if (file.toLowerCase().endsWith('.pdf')) {
                        attachments.push({
                            filename: file,
                            path: filePath
                        });
                        console.log(`[sendEmail] Attaching file: ${filePath}`);
                    } else {
                        console.log(`[sendEmail] Skipping non-PDF file: ${filePath}`);
                    }
                });
            }
        } catch (err) {
            console.error('[sendEmail] Error reading PDF directory:', err);
        }

        let mailOptions = {
            from: fromEmail,
            to: toEmails,
            subject: subject,
            text: text,
            attachments: attachments
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error('[sendEmail] Error sending email:', error);
            } else {
                console.log('[sendEmail] Email sent successfully:', info.response);
                try {
                    clearDirectory();
                    console.log('[sendEmail] PDF directory cleared after sending email.');
                } catch (clearErr) {
                    console.error('[sendEmail] Error clearing PDF directory:', clearErr);
                }
            }
        });
    } catch (outerErr) {
        console.error('[sendEmail] Unexpected error:', outerErr);
    }
 }

 module.exports = sendEmail;