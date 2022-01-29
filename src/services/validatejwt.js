const jwt = require('jsonwebtoken')

const settings = require('../../settings.json')

//Authenticate with token
function verifyToken(token, secret = settings.jwtsecret) {
    if (!token) return { message: 'No token provided', status: 400, success: false }
    return jwt.verify(token, secret, function (err, decoded) {
        if (err) return { message: 'Error decoding token', status: 500, success: false }
        else return { status: 200, id: decoded, auth: true, success: true }
    })
}

//Authenticating with token and then decoding token
function verifyAndDecode(token) {
    try {
        return jwt.verify(token, settings.jwtsecret)
    } catch (error) {
        return undefined
    }
}

module.exports = { verifyAndDecode, verifyToken }