import { secretKey } from "../config.js";
import jwt from 'jsonwebtoken';
import { logger } from "../config.js";

export const authenticate = (req, res, next) => {
    console.log('authenticate')
    const authHeader = req.get('Authorization')
    console.log('header', authHeader)
    const accessToken = authHeader ? authHeader.split(' ')[1] : null;
    const refreshToken = (req.cookies && req.cookies['refreshToken']) ? req.cookies['refreshToken'] : null

    logger.info(`tokens ${!!accessToken} ${!!refreshToken}`)
    if (!accessToken && !refreshToken) {
      return res.status(401).send({
        success: 0,
        message: 'Access Denied',
        error: 'No authorization token provided'
      });
    }
  
    try {
      const decoded = jwt.verify(accessToken.trim(), secretKey);
      req.user = decoded.user;
      console.log('decoded')
      console.log(decoded)
      console.log(decoded.user)
      next();
    } catch (error) {
      if (!refreshToken) {
        return res.status(401).send({
            success: 0,
            message: 'Access Denied',
            error: 'No refresh token provided'
          });
      }
  
      try {
        const decoded = jwt.verify(refreshToken, secretKey);
        const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });
  
        res
          .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
          .header('Authorization', accessToken)
          .send(decoded.user);
        req.user = decoded.user
        console.log('decoded')
        console.log(decoded)
        console.log(decoded.user)
        next();
      } catch (error) {
        console.log('error', error)
        return res.status(400).send({
            success: 0,
            message: 'Access Denied',
            error: 'Missing or Invalid token.'
          });
      }
    }
  };