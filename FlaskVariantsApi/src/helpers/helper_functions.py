import json
from flask import jsonify
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s',
                    datefmt='%m/%d/%Y %H:%M:%S %Z')
logger = logging.getLogger(__name__)


def parse_db_res(data):
    if isinstance(data, list):
        for item in data:
            item['_id']= str(item['_id'])
            if item.get('created_at', ''):
              item['created_at'] = parse_db_date(item['created_at'])
    else:
        data['_id'] = str(data['_id'])
        if data.get('created_at', ''):
          data['created_at'] = parse_db_date(data['created_at'])
    return json.loads(json.dumps(data)) # json.loads(json_util.dumps(data))

def parse_db_date(my_date):
    return my_date if isinstance(my_date, str) else my_date.isoformat()
