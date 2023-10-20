// const { Resend } = require("resend");

// const resend = new Resend('re_aH7GBkX4_4nHJS13XTxvFDDgtiHu8D9Vw');

// exports.sendVerificationEmail = async (email,verificationToken) => {
//     try {
//     await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>',
//       to: [email],
//       subject: 'Hello World',
//       html: '<strong>It works!</strong>',
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.API_MAILGUN});

exports.sendVerificationEmail = async (email,verificationToken) => {
mg.messages.create('sandbox9c2f09f12d7043a4947c3f5df75b63db.mailgun.org', {
	from: "Excited User <mailgun@sandbox-123.mailgun.org>",
	to: [email],
	subject: "Hello",
	html: `<h1>Email verification</h1><p>Please verify your email using following link: /users/verify/${verificationToken}</p>`
})
.then(msg => console.log(msg)) // logs response data
        .catch(err => console.log(err)); // logs any error
}