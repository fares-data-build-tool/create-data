import os
from unittest.mock import patch, MagicMock
import boto3

from xml_uploader.xml_uploader import download_from_s3_and_write_to_db, extract_data_for_tnds_operator_service_table, collect_journey_pattern_section_refs_and_info, collect_journey_patterns, iterate_through_journey_patterns_and_run_insert_queries

from tests.helpers import test_xml_helpers
from tests.helpers.test_data import test_data

mock_data_dict = test_xml_helpers.generate_mock_data_dict()


class TestDatabaseInsertQuerying:
    @patch('xml_uploader.xml_uploader.insert_into_tnds_journey_pattern_link_table')
    @patch('xml_uploader.xml_uploader.insert_into_tnds_journey_pattern_table')
    def test_insert_methods_are_called_correct_number_of_times(self, mock_jp_insert, mock_jpl_insert):
        service = mock_data_dict['TransXChange']['Services']['Service']
        mock_journey_patterns = collect_journey_patterns(
            mock_data_dict, service)
        mock_jp_insert.side_effect = [
            9, 27, 13, 1, 11, 5, 28, 12, 10, 6, 13, 27, 4]
        mock_cursor = MagicMock()
        mock_op_service_id = 12
        iterate_through_journey_patterns_and_run_insert_queries(
            mock_cursor, mock_data_dict, mock_op_service_id, service)

        assert mock_jp_insert.call_count == len(mock_journey_patterns)
        assert mock_jpl_insert.call_count == len(mock_journey_patterns)


class TestDataCollectionFunctionality:
    def test_extract_data_for_tnds_operator_service_table(self):
        expected_operator_and_service_info = (
            'ANWE', '2018-01-28', 'ANW', 'Macclesfield - Upton Priory Circular', 'NW_01_ANW_4_1')
        operator = mock_data_dict['TransXChange']['Operators']['Operator']
        service = mock_data_dict['TransXChange']['Services']['Service']

        assert extract_data_for_tnds_operator_service_table(
            operator, service) == expected_operator_and_service_info

    def test_collect_journey_pattern_section_refs_and_info(self):
        mock_raw_journey_patterns = mock_data_dict['TransXChange'][
            'Services']['Service']['StandardService']['JourneyPattern']
        assert collect_journey_pattern_section_refs_and_info(
            mock_raw_journey_patterns) == test_data.expected_list_of_journey_pattern_section_refs

    def test_collect_journey_patterns(self):
        service = mock_data_dict['TransXChange']['Services']['Service']
        assert collect_journey_patterns(
            mock_data_dict, service) == test_data.expected_list_of_journey_patterns


class TestMainFunctionality:
    @patch('xml_uploader.xml_uploader.write_to_database')
    def test_integration_between_s3_download_and_database_write_functionality(self, db_patch, s3):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        mock_file_dir = dir_path + '/helpers/test_data/mock_tnds.xml'
        mock_bucket = 'test-bucket'
        mock_key = 'test-key'
        db_connection = MagicMock()
        logger = MagicMock()
        conn = boto3.resource('s3', region_name='eu-west-2')
        # pylint: disable=no-member
        conn.create_bucket(Bucket=mock_bucket)
        s3.put_object(Bucket=mock_bucket, Key=mock_key,
                      Body=open(mock_file_dir, 'rb'))

        download_from_s3_and_write_to_db(
            s3, mock_bucket, mock_key, mock_file_dir, db_connection, logger)
        db_patch.assert_called_once_with(
            mock_data_dict, mock_key, db_connection, logger)
