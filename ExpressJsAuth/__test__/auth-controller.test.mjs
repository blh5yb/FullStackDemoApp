import { jest, expect} from '@jest/globals';

jest.unstable_mockModule('../src/services/auth.service.js', async () => ({
    createUser: jest.fn()
}) )
const authControllers = await import('../src/controllers/auth.controller')

describe('Auth Controller Tests',() => {
    let mockRes;
    let user = {name: 'user1', email: 'test@email.com', password: 'password'}
    let userWithId = {_id: 'userId', name: 'user1', email: 'test@email.com', password: 'password'}
    let accessToken = 'access_token' 
    let refreshToken = 'refresh_token' 

    beforeAll(async () => {
    })
    beforeEach( async () => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis(),
            header: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
    })

    afterEach(() => {
        jest.resetAllMocks();
      }
    );
    it('Should execute the create User and access token', async () => {
        let authService = await import('../src/services/auth.service.js')
        authService.createUser.mockImplementation((req, callback) => {return callback(null, {user, accessToken, refreshToken})})
        const req = {
            body: user,
            query: {},
            params: {}
        }
        await authControllers.registrationController(req, mockRes)
        expect(authService.createUser).toBeCalledTimes(1)
        //console.log(mockRes)
        //expect(authService.createUser).toHaveBeenCalled();
        expect(mockRes.header).toHaveBeenCalledWith('Authorization', accessToken)
        expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        expect(mockRes.status).toHaveBeenCalledWith(200)
    })
})