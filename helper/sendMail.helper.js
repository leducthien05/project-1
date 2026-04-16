const nodemailer = require("nodemailer");

module.exports.sendMailer = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ducthien090905@gmail.com",
            pass: "zbvz ezjv gdhp vtmp"
        },
    });
    const message = {
        from: "ducthien090905@gmail.com",
        to: email,
        subject: subject,
        html: html
    };
    return transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}