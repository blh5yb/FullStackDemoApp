import mockingoose from "mockingoose";
import { jest, expect, beforeAll} from '@jest/globals';
import * as authService from '../src/services/auth.service'
import userModel from "../src/models/user.model";
//import bcrypt from 'bcryptjs/dist/bcrypt.js';
import jwt from 'jsonwebtoken';

const bcrypt = jest.genMockFromModule('bcryptjs/dist/bcrypt.js');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    let user = {name: 'User1', email: 'user1@email.com', password: 'password'}
    let userWithId = JSON.parse(JSON.stringify(user))
    userWithId._id = 'z1y2x3v4'
    let passHash = "hashedPassword"
    userWithId.password = passHash
    let accessToken = 'access_token' 
    let refreshToken = 'refresh_token' 

    beforeAll(async () => {
        bcrypt.hash = jest.fn((password, saltRounds) => {
          return Promise.resolve(passHash)
        })
    })

    beforeEach(async () => {
        mockingoose.resetAll();
    })
    it('Should create a user and return status ok and auth tokens', async () => {
        mockingoose(userModel).toReturn(userWithId, 'save')
        jwt.sign = jest.fn()
          .mockReturnValueOnce(accessToken)
          .mockReturnValueOnce(refreshToken)
        
        const req = {
            body: user,
            query: {},
            params: {}
        }
        await authService.createUser(req.body, (error, results) => {
            expect(results.accessToken).toBe(accessToken)
            expect(results.refreshToken).toBe(refreshToken)
            expect(results.user.password).toBe(passHash)
            expect(error).toBeNull()
        })
    })
}

)