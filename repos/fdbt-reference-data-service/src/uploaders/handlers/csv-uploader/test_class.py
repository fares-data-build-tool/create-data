import pytest

from db_querys import *

class TestClass:
    def test_public_name_bucket_insertion(self):
        bucket = 'unit-test-bucket'
        result = public_name_query(bucket)
        assert result[2].__contains__(bucket)

    def test_noc_table_bucket_insertion(self):
        bucket = 'unit-test-bucket'
        result = noc_table_query(bucket)
        assert result[2].__contains__(bucket)

    def test_noc_lines_bucket_insertion(self):
        bucket = 'unit-test-bucket'
        result = noc_lines_query(bucket)
        assert result[2].__contains__(bucket)

    def test_stops_bucket_insertion(self):
        bucket = 'unit-test-bucket'
        result = stops_query(bucket)
        assert result[2].__contains__(bucket)

    def test_service_report_bucket_insertion(self):
        bucket = 'unit-test-bucket'
        result = service_report_query(bucket)
        assert result[2].__contains__(bucket)
       
