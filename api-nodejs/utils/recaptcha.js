const axios = require('axios');

async function confirmCaptcha(captchaValue) {
    const query = await axios.get('https://www.google.com/recaptcha/api/siteverify', {
    params: {
        secret: process.env.CAPTCHA_SECRET_KEY,
        response: captchaValue ? captchaValue : '0'
    }
    })
    .then(function (response) {
        return response.data.success
    })
    .catch(function () {
        return false;
    })

    return query
}

module.exports = confirmCaptcha