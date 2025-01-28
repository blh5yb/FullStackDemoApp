import * as authService from '../services/auth.service.js';
import { demoAccounts, isDev, logger } from "../config.js";
import { assertUser } from '../helpers.js';

//class User {
//    constructor(user) {
//        this.email = user.email
//        this.password = user.password
//        this.name = user.name
//    }
//}

export const registrationController = async(req, res, next) => {
    return await authService.createUser(req.body, (error, results) => {
        if (error) {
            let message = 'Authentication failed'
            if (error === 'EMAIL_EXISTS'){
                message = 'EMAIL_EXISTS'
            }
            logger.fatal(error)
            return res.status(500).send({
                success: 0,
                message: message,
                error: `${error}`
            })
        } else {
            logger.info(`token created`)
            return res.status(200)
            .cookie('refreshToken', results.refreshToken, { httpOnly: true, sameSite: 'strict' })
            .header('Authorization', results.idToken)
            .send({
                success: 1,
                data: results,
                error: null
            })
        }
    })
}

export const loginController = async(req, res, next) => {
    //const user = new User(req.body, res)
    return await authService.signInUser(req.body, (error, results) => {
        if (error) {
            logger.fatal(error)
            let status = 500;
            let message = 'Login failed'
            if (error.includes('Authentication failed')){
                status = 401
                message = 'Authentication failed'
            } else if (error.includes('EMAIL_NOT_FOUND')){
                status = 401
                message = 'EMAIL_NOT_FOUND'
            } else if (error.includes('INVALID_PASSWORD')){
                status = 401
                message = 'INVALID_PASSWORD'
            } 
            return res.status(status).send({
                success: 0,
                message: message,
                error: `${error}`
            })
        } else {
            logger.info(`token created`)
            return res.status(200)
                .cookie('refreshToken', results.refreshToken, { 
                    httpOnly: true, secure: !isDev, sameSite: 'none',
                    maxAge: 24 * 60 * 60 * 1000
                })
                .setHeader('Authorization', results.idToken)
                .send({
                    success: 1,
                    data: results,
                    error: null
            })
        }
    })
}

export const logoutController = async(req, res, next) => {
    //const user = new User(req.body, res)
    if (req.session){
        req.session.destroy((err) => {
            if (err){
                return res.status(400)
                .send({
                    success: 1,
                    message: 'LOGOUT',
                    error: `${error}`
                })
            } else {
                return res.status(200)
                .clearCookie('refreshToken')
                .send({
                    success: 1,
                    message: 'Successfully ended api session',
                    error: null
                })
            }
        })
    }
}

export const refreshController = async(req, res, next) => {
    const refreshToken = (req.cookies && req.cookies['refreshToken']) ? req.cookies['refreshToken'] : null
    if (!refreshToken){
        return res.status(401).send({
            success: 0,
            message: 'Access_Denied',
            error: 'No refresh token provided'
          });
    } else {
        return await authService.refreshUser(refreshToken, (error, results) => {
            if (error){
                return res.status(400)
                .send({
                    success: 1,
                    message: 'Invalid refresh token.',
                    error: `${error}`
                })
            } else {
                const {accessToken, decoded} = results
                return res.status(200)
                    .header('Access-Control-Expose-Headers', 'Authorization')
                    .header('Authorization', accessToken)
                    .send({
                        success: 1,
                        data: decoded.user,
                        error: null
                    })
            }
        })
    }
}

export const deleteController = async(req, res, next) => {
    if (demoAccounts[req.user.email]){
        logger.fatal(`Attempted to delete demo account. Denied`)
        return res.status(500).send({
            success: 0,
            message: 'DEMO_ACCOUNT',
            error: `Attempted to delete demo account.`
        })
    }
    if (!req.user){
        logger.fatal(`User not found`)
        return res.status(500).send({
            success: 0,
            message: 'USER_NOT_FOUND',
            error: `User not found or not authorized`
        })
    }
    //const filter = {_id: deleteUser._id, email: deleteUser.email}
    return await authService.deleteUser(req.user, (error, results) => {
        if (error) {
            logger.fatal(error)
            return res.status(500).send({
                success: 0,
                message: 'Failed to delete user',
                error: `${error}`
            })
        } else {
            logger.info(`deleted user`)
            return res.status(200)
            .clearCookie('refreshToken')
            .send({
                success: 1,
                data: results,
                error: null
            })
        }
    })
}

export const checkEmailController = async(req, res, next) => {
    return await authService.checkEmail(req.params.email, (error, results) => {
        if (error) {
            logger.fatal(error)
            return res.status(500).send({
                success: 0,
                message: 'Failed to query db',
                error: `${error}`
            })
        } else {
            logger.info(`email checked`)
            return res.status(200)
            .send({
                success: 1,
                data: results,
                error: null
            })
        }
    })
}