import { logger, secretKey } from './config.js';
import jwt from 'jsonwebtoken';

export const assert = (data, value) => {
    if(!data[value]){
        throw new Error(`endpoint called without ${value} data`);
    } else {
        logger.error(`Input parameter, ${value}, successfully asserted`)
        return data[value];
    }

}

export const assertUser = (req) => {
    const authHeader = req.get('Authorization')
    console.log('header', authHeader)
    const accessToken = authHeader ? authHeader.split(' ')[1] : null;
    const decoded = jwt.verify(accessToken.trim(), secretKey);
    return decoded.user;
}