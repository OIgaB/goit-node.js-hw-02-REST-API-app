import sgMail from '@sendgrid/mail';
import 'dotenv/config';

const { SENDGRID_API_KEY, EMAIL_FROM } = process.env; // забираємо зі змінних оточень ключ до sendgrid

sgMail.setApiKey(SENDGRID_API_KEY); // передаємо sendgrid ключ

const sendEmail = async (data) => {
    const email = { ...data, from: EMAIL_FROM };
    await sgMail.send(email)
        .then(() => console.log('Email was sent successfuly'))
        .catch(error => console.log(error.message))
    // return true;
};

export default sendEmail;