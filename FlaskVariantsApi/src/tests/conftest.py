import os
from dotenv import load_dotenv
import pytest
from src.app import create_app
from unittest.mock import patch


@pytest.fixture(scope="session")
def app():
    load_dotenv()

    test_app = create_app('config.BaseConfig')
    test_app.config.update({
        'TESTING': True,
    })

    yield test_app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


@pytest.fixture(scope='function')
def mongo_mock(app):
    """create mongo db collection find mock"""
    with patch('db.db.mongo.db') as mock_mongo:
        yield mock_mongo
