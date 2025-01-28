
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import userModel from '../models/user.model.js';
import { secretKey } from '../config.js';

export const checkEmail = async(email, callback) => {
    const user = await userModel.findOne({email: email})
    return callback(null, !!user);
}

const signJWT = async(user) => {
    const accessToken = jwt.sign({user: {_id: user._id, email: user.email}}, secretKey, {expiresIn: '1h'});
    const refreshToken = jwt.sign({user: {_id: user._id, email: user.email}}, secretKey, {expiresIn: '1d'});
    const accessExpiry = 60 * 60
    const refreshExpiry = accessExpiry * 24
    const res = {
        name: user.name,
        email: user.email,
        localId: `${user._id}`,
        registered: true,
        expiresIn: refreshExpiry,
        idToken: accessToken,
        refreshToken: refreshToken,
    }
    return res
}

export const createUser = async(reqBody, callback) => {
    try {
        const checkUser = await userModel.findOne({email: reqBody.email})  // check email is unique
        if (!!checkUser){
            throw new Error("EMAIL_EXISTS")
        }
        const newUser = new userModel({
            name: reqBody.name,
            email: reqBody.email,
            password: reqBody.password
        })
        const user = await newUser.save();
        const res = await signJWT(user)
        return callback(null, res);
    } catch (error){
        return callback(`Error registering user ${reqBody.name}: ${error}`)
    }
}

export const signInUser = async(reqBody, callback) => {
    try {
        const user = await userModel.findOne({email: reqBody.email})
        if (!user){
            return callback(`EMAIL_NOT_FOUND`)
        }
        const passwordMatch = await bcrypt.compare(reqBody.password, user.password);
        if (!passwordMatch){
            return callback(`INVALID_PASSWORD`)
        }
        const res = await signJWT(user)
        return callback(null, res);
    } catch (error) {
        return callback(`Login failed: ${error}`)
    }
}

export const refreshUser = async(refreshToken, callback) => {
    try {
        const decoded = jwt.verify(refreshToken, secretKey);
        const accessToken = jwt.sign({user: decoded.user}, secretKey, {expiresIn: '1h'})
        return callback(null, {accessToken, decoded})
    } catch (error) {
        return callback(`Invalid refresh token: ${error}`)
    }
}

export const deleteUser = async(filter, callback) => {
    try {
        await userModel.findOneAndDelete(filter)
        return callback(null, 'Successfully deleted user');
    } catch (error){
        return callback(`Error registering user ${reqBody.name}: ${error}`)
    }
}