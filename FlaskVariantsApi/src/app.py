from flask import Flask
from flask_restful import Api
from flask_cors import CORS

# export path
import os, sys
dir_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src'))
sys.path.append(dir_path)

from controllers.variant import *
from helpers.format_error_msg import format_error_message
from err_msg import UNAUTHORIZED, SERVER_ERROR, UNKNOWN
from db.db import mongo


from helpers.helper_functions import logger
port = os.getenv('NODE_LOCAL_PORT')
app = Flask(__name__)
#app.config.from_object('config.BaseConfig')
#mongo.init_app(app)
#api = Api(app)
#
#api.add_resource(VariantsApi, '/flask-api/variants')
#api.add_resource(VariantApi, '/flask-api/variants/<id>')

@app.errorhandler(SystemError) # catched the auth middle ware error
def handle_auth_error(e):
      logger.error(f'User unauthorized: {e}')
      return format_error_message(UNAUTHORIZED, 'User is not authorized to make this request', 'variants')

@app.errorhandler(EnvironmentError)
def handle_environment(err):
  if 'exceeded maximum database items' in err:
      logger.error('exceeded maximum db variants')
      max_variants = os.getenv('MAX_VARIANTS')
      return format_error_message(SERVER_ERROR, err, max_variants)
  else:
    return format_error_message(UNKNOWN, err,  'unknown')


def create_app(config_filename):
    allowedOrigins = os.getenv('allowedOrigins').split(' ')
    CORS(app, origins=allowedOrigins, allow_headers=["Content-Type", "Authorization"], supports_credentials=True)

    app.config.from_object(config_filename)
    mongo.init_app(app)
    api = Api(app)

    api.add_resource(VariantsApi, '/flask-api/variants')
    api.add_resource(VariantApi, '/flask-api/variants/<id>')
    return app


# reverse these comments for lambda deployment
app = create_app('config.BaseConfig')
logger.info(f"App is running on port {port}")
# if __name__ == '__main__':
#     isDEV = True if os.getenv('isDEV') == 'true' else False
#     
#     my_app = create_app('config.BaseConfig')
#     my_app.run(host='0.0.0.0', port=port, debug=isDEV, use_reloader=True)
#     logger.info(f"App is running on port {port}")
