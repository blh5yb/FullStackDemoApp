import { assert } from "../helpers.js";
import { logger } from '../config.js';


export const userfilter = (req, res, next) => {
    const user_fields = ['email', 'id'];
    try {
        for (let field of user_fields){
            req.body[field] = assert(req.body, field)
        }
        next();
    } catch (error){
        //logger.fatal(`parameter, ${value}, not provided`)
        logger.fatal(error)
        return res.status(400).send({
            success: 0,
            message: 'Missing or invalid parameter(s)',
            error: `${error}`
        })
    }
}

export const userValidation = (req, res, next) => {
    const user_fields = ['email', 'password'];
    if (req.url.includes('register')){
        user_fields.push('name')
    }
    try {
        for (let field of user_fields){
            req.body[field] = assert(req.body, field)
        }
        next();
    } catch (error){
        //logger.fatal(`parameter, ${value}, not provided`)
        logger.fatal(error)
        return res.status(400).send({
            success: 0,
            message: 'Missing or invalid parameter(s)',
            error: `${error}`
        })
    }
}