const jwt = require('jsonwebtoken')

const settings = require('../../settings.json')

//Authenticate with token
function verifyToken(token, secret = settings.jwtsecret) {
    if (!token) return { message: 'No token provided', status: 400, success: false }
    return jwt.verify(token, secret, function (err, decoded) {
        if (err) return { message: 'Error decoding token', status: 500, success: false }
        else return { status: 200, id: decoded, auth: true }
    })
}

//Authenticating with token and then decoding token
function verifyAndDecode(token, secret = settings.jwtsecret) {
    if (!token) return { message: 'No token provided', status: 400, success: false }
    const isValid = verifyToken(token);
    if (isValid.status !== 200) return isValid
    else return jwt.decode(token, (err, decoded) => {
        if (err) console.log(err)
        return decoded
    })
}

module.exports = verifyToken, { verifyAndDecode }