import sgMail from '@sendgrid/mail';
import 'dotenv/config';

const { SENDGRID_API_KEY, EMAIL_FROM } = process.env; // забираємо зі змінних оточень ключ до sendgrid

sgMail.setApiKey(SENDGRID_API_KEY); // передаємо sendgrid ключ

// const email = {
//     to: 'fitacaw793@royalka.com',
//     from: 'своє мило',
//     subject: 'Test email',
//     html: '<p><strong>Test email</strong> from localhost:3000</p>'
// };

// sendgridMail.send(email)
//     .then(() => console.log('Email was sent successfuly'))
//     .catch(error => console.log(error.message))

const sendEmail = async (data) => {
    const email = { ...data, from: EMAIL_FROM };
    await sgMail.send(email)
        .then(() => console.log('Email was sent successfuly'))
        .catch(error => console.log(error.message))
    // return true;
};

export default sendEmail;