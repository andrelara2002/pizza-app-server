const jwt = require('jsonwebtoken')

//Authenticate with token
function verifyToken(token, secret) {
    if (!token) return { message: 'No token provided', status: 400, success: false }
    return jwt.verify(token, secret, function (err, decoded) {
        if (err) return { message: 'Error decoding token', status: 500, success: false }
        else return { status: 200, id: decoded, auth: true }
    })
}

module.exports = verifyToken