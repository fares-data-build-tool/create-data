import os
from unittest.mock import patch, MagicMock

import boto3

from txc_uploader.txc_processor import (
    download_from_s3_and_write_to_db,
    extract_data_for_txc_operator_service_table,
    collect_journey_pattern_section_refs_and_info,
    collect_journey_patterns,
    iterate_through_journey_patterns_and_run_insert_queries,
    check_file_has_usable_data,
    create_unique_line_id
)

from tests.helpers import test_xml_helpers
from tests.helpers.test_data import test_data

logger = MagicMock()
mock_data_dict = test_xml_helpers.generate_mock_data_dict()
mock_non_bus_dict = test_xml_helpers.generate_mock_ferry_txc_data_dict()
mock_invalid_data_dict = test_xml_helpers.generate_mock_invalid_data_dict()


class TestLineIdGeneration:
    def test_function_returns_correctly_structured_line_id(self):
        assert(create_unique_line_id("BLAC", "UNIQ123")) == "UZ000BLAC:BLACUNIQ123"

class TestNonBusFileHasUsableData:
    def test_non_bus_file_with_valid_data_is_usable(self):
        data = mock_non_bus_dict
        service = mock_non_bus_dict["TransXChange"]["Services"]["Service"]
        assert check_file_has_usable_data(data, service) == True

class TestFileHasUsableData:
    def test_file_with_valid_data_is_usable(self):
        data = mock_data_dict
        service = mock_data_dict["TransXChange"]["Services"]["Service"]
        assert check_file_has_usable_data(data, service) == True

    def test_file_with_invalid_data_is_not_usable(self):
        data = mock_invalid_data_dict
        service = mock_invalid_data_dict["TransXChange"]["Services"]["Service"]
        assert check_file_has_usable_data(data, service) == False


class TestDatabaseInsertQuerying:
    @patch("txc_uploader.txc_processor.insert_into_txc_journey_pattern_table")
    @patch("txc_uploader.txc_processor.insert_into_txc_journey_pattern_link_table")
    def test_insert_methods_are_called_correct_number_of_times(
        self, mock_jp_insert, mock_jpl_insert
    ):
        service = mock_data_dict["TransXChange"]["Services"]["Service"]
        mock_journey_patterns = collect_journey_patterns(mock_data_dict, service)
        mock_jp_insert.side_effect = [9, 27, 13, 1, 11, 5, 28, 12, 10, 6, 13, 27, 4]
        mock_cursor = MagicMock()
        mock_op_service_id = 12
        iterate_through_journey_patterns_and_run_insert_queries(
            mock_cursor, mock_data_dict, mock_op_service_id, service
        )

        assert mock_jp_insert.call_count == len(mock_journey_patterns)
        assert mock_jpl_insert.call_count == len(mock_journey_patterns)


class TestDataCollectionFunctionality:
    def test_extract_data_for_txc_operator_service_table(self):
        expected_operator_and_service_info = (
            "ANWE",
            "2018-01-28",
            "2099-12-31",
            "ANW",
            "The Pike - Evesham Country Park",
            "Evesham Country Park - The Pike",
            "Macclesfield - Upton Priory Circular",
            "NW_01_ANW_4_1",
            "Macclesfield",
            "Macclesfield",
            "bus"
        )
        operator = mock_data_dict["TransXChange"]["Operators"]["Operator"]
        service = mock_data_dict["TransXChange"]["Services"]["Service"]
        line = service["Lines"]["Line"]

        assert (
            extract_data_for_txc_operator_service_table(operator, service, line)
            == expected_operator_and_service_info
        )

    def test_extract_data_for_non_bus_txc_operator_service_table(self):
        expected_operator_and_service_info = (
            "NXSF",
            "2022-07-25",
            "2023-02-02",
            "NEXUS Ferry",
            "",
            "",
            "South Shields - North Shields",
            "NE_04_FER_FERR_1",
            "South Shields",
            "North Shields",
            "ferry"
        )
        operator = mock_non_bus_dict["TransXChange"]["Operators"]["Operator"]
        service = mock_non_bus_dict["TransXChange"]["Services"]["Service"]
        line = service["Lines"]["Line"]

        assert (
            extract_data_for_txc_operator_service_table(operator, service, line)
            == expected_operator_and_service_info
        )

    def test_collect_journey_pattern_section_refs_and_info(self):
        mock_raw_journey_patterns = mock_data_dict["TransXChange"]["Services"][
            "Service"
        ]["StandardService"]["JourneyPattern"]
        assert (
            collect_journey_pattern_section_refs_and_info(mock_raw_journey_patterns)
            == test_data.expected_list_of_journey_pattern_section_refs
        )

    def test_collect_journey_patterns(self):
        service = mock_data_dict["TransXChange"]["Services"]["Service"]
        assert (
            collect_journey_patterns(mock_data_dict, service)
            == test_data.expected_list_of_journey_patterns
        )


class TestMainFunctionality:
    @patch("txc_uploader.txc_processor.write_to_database")
    def test_integration_between_s3_download_and_database_write_functionality(
        self, db_patch, s3, cloudwatch
    ):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        mock_file_dir = dir_path + "/helpers/test_data/mock_txc.xml"
        mock_bucket = "test-bucket"
        mock_key = "tnds/WM/test-key"
        db_connection = MagicMock()
        conn = boto3.resource("s3", region_name="eu-west-2")
        # pylint: disable=no-member
        conn.create_bucket(Bucket=mock_bucket)
        s3.put_object(Bucket=mock_bucket, Key=mock_key, Body=open(mock_file_dir, "rb"))

        download_from_s3_and_write_to_db(
            s3, cloudwatch, mock_bucket, mock_key, mock_file_dir, db_connection, logger
        )
        db_patch.assert_called_once_with(
            mock_data_dict, "WM", "tnds", mock_key, db_connection, logger, cloudwatch
        )
