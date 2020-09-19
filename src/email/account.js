// const sendGridAPIKey = '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';
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'tranminhtri9090@gmail.com',
        subject: 'Welcome to Task Manager',
        text: `Thank ${name} for signing with our services, we wish you best luck`
    });
}

const sendDeletEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'tranminhtri9090@gmail.com',
        subject: 'Task Manager Delete Account Confirmation',
        text: `We really sorry for what happens ${name} :( Can you please tell us what is wrong so we can make it better in the future ? We wish you have a good day !`
    });
}

module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendDeletEmail : sendDeletEmail
}
