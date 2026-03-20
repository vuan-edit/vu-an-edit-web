const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vuanedit-secret-key-2026';

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, plan_id: user.plan_id },
        JWT_SECRET,
        { expiresIn: '30d' }
    );
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

module.exports = {
    generateToken,
    authenticateToken
};
