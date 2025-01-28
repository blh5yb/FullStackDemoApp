import os

class BaseConfig:
    DEBUG = os.getenv('isDEV')
    MONGO_URI = os.getenv('MONGO_URI')
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET')
    #MONGODB_SETTINGS = { Mongo engine way
    #    "host": os.getenv('MONGO_URI')
    #}
