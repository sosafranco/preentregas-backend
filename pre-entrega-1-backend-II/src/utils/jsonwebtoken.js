import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign({ user }, 'your_secret_jwt', { expiresIn: '1h' });
};

export default generateToken;
