const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const FullToken = req.headers.authorization;
    if (!FullToken) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = FullToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden-access' })
        }
        else {
            req.decoded = decoded;
            next();
        }
    })
}



module.exports = {verifyToken};