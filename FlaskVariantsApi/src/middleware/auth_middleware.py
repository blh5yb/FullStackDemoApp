import jwt
from helpers.helper_functions import logger
from flask import request
import os

class AuthMiddleware:

  @staticmethod
  def is_valid_token(token):
    secret = os.getenv('JWT_SECRET')
    try:
      return jwt.decode(token, secret, algorithms=["HS256"])
    except Exception as e:
      logger.error(e)
  def authenticate(self):
    auth_token = request.headers.get('Authorization')
    if not auth_token:
        raise SystemError('User is not authorized')

    valid = self.is_valid_token(auth_token.split(' ')[1])
    print('valid', valid)
    if not not self.is_valid_token(auth_token.split(' ')[1]):
        print('unauthorized')
        raise SystemError('User is not authorized')

def require_authentication(func):
  def wrapper(*args, **kwargs):
    AuthMiddleware().authenticate()
    return func(*args, **kwargs)

  return wrapper
