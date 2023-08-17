const { BASE_URL } = process.env; // беремо BASE_URL у змінних оточеннях

const createVerificationEmail = (email, verificationToken) => {
    const verifyEmail = {
        to: email, // кому буде приходити email на підтвердження (можна використати тимчасову пошту на https://temp-mail.org/uk/)
        subject: 'Please confirm your email address',
        html: `<a target='_blank' href="${BASE_URL}/api/auth/verify/${verificationToken}">Let's verify your email so you can start login. Click here to verify.</a>`
    } // при переході за посиланням спрацьовує GET-запит
    return verifyEmail;
};

export default createVerificationEmail;