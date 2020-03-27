import pytest

from db_querys import public_name_query

class TestClass:
    def test_one(self):
        bucket = 'unit-test-bucket'
        result = public_name_query(bucket)
        assert result[2].__contains__(bucket)
       
