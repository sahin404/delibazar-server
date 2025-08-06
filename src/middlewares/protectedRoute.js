import jwt from 'jsonwebtoken'

const protectedRoute = (req, res, next) => {
    const FullToken = req.headers.authorization;
    if (!FullToken) {
        return res.status(401).json({ message: 'unauthorized access' });
    }
    const token = FullToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'forbidden-access' })
        }
        else {
            req.decoded = decoded;
            next();
        }
    })
}

export default protectedRoute;