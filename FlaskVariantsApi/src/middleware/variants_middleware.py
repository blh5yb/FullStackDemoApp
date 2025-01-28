import os
from pymongo.collection import Collection
from db import db
from helpers.helper_functions import logger
from flask import request


class VariantsMiddleware:
  """Variants Middleware"""
  def __init__(self):
      """Init db cursor"""
      self.variant_cltn: Collection = db.mongo.db['variants']

  def check_variants_collection(self):
    """make sure database size doesnt surpass predefined maximum"""
    max_variants = os.getenv('MAX_VARIANTS')
    count = self.variant_cltn.count_documents({})
    if count >= int(max_variants):
        raise EnvironmentError('exceeded maximum database items')

    logger.info(f"passed db check: {count} saved variants")


def limit_variants(func):
  def wrapper(*args, **kwargs):
    VariantsMiddleware().check_variants_collection()
    return func(*args, **kwargs)
  return wrapper
