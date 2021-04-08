import os
import xmltodict
import xml.etree.ElementTree as eT
import pymysql

NOC_INTEGRITY_ERROR_MSG = 'Cannot add or update a child row: a foreign key constraint fails (`fdbt`.`txcOperatorLine`, CONSTRAINT `fk_txcOperatorLine_nocTable_nocCode` FOREIGN KEY (`nocCode`) REFERENCES `nocTable` (`nocCode`))'


def put_metric_data_by_data_source(cloudwatch, data_source, metric_name, metric_value):
    cloudwatch.put_metric_data(
        MetricData = [
            {
                'MetricName': metric_name,
                'Dimensions': [
                    {
                        'Name': 'By Data Source',
                        'Value': data_source
                    },
                ],
                'Unit': 'None',
                'Value': metric_value
            },
        ],
        Namespace='FDBT/Reference-Data-Uploaders'
    )

def make_list(item):
    if not isinstance(item, list):
        return [item]

    return item


def get_operators(data_dict, data_source, cloudwatch):
    operators = data_dict['TransXChange'].get('Operators', None)

    if operators:
        operator_list = make_list(operators.get('Operator', []))
        licensed_operator_list = make_list(operators.get('LicensedOperator', []))

        return operator_list + licensed_operator_list

    return []


def get_services_for_operator(data_dict, operator):
    services = make_list(data_dict['TransXChange']['Services']['Service'])
    services_for_operator = [
        service for service in services if service['RegisteredOperatorRef'] == operator['@id']]

    return services_for_operator


def get_lines_for_service(service):
    return make_list(service['Lines']['Line'])


def extract_data_for_txc_operator_service_table(operator, service):
    noc_code = operator['NationalOperatorCode']
    start_date = service['OperatingPeriod']['StartDate']
    operator_short_name = operator['OperatorShortName']
    service_description = service['Description'] if 'Description' in service else ''
    service_code = service['ServiceCode'] if 'ServiceCode' in service else None
    standard_service = service['StandardService'] if 'StandardService' in service else None
    origin = standard_service['Origin'] if standard_service and 'Origin' in standard_service else None
    destination = standard_service['Destination'] if standard_service and 'Destination' in standard_service else None

    return noc_code, start_date, operator_short_name, service_description, service_code, origin, destination


def collect_journey_pattern_section_refs_and_info(raw_journey_patterns):
    journey_patterns = []

    for raw_journey_pattern in raw_journey_patterns:
        journey_pattern_info = {
            'direction': raw_journey_pattern['Direction'] if 'Direction' in raw_journey_pattern else None,
            'destination_display': raw_journey_pattern['DestinationDisplay']
            if 'DestinationDisplay' in raw_journey_pattern else None}

        raw_journey_pattern_section_refs = raw_journey_pattern['JourneyPatternSectionRefs']
        journey_patterns.append({
            'journey_pattern_info': journey_pattern_info,
            'journey_pattern_section_refs': make_list(raw_journey_pattern_section_refs)
        })

    return journey_patterns


def process_journey_pattern_sections(journey_pattern_section_refs, raw_journey_pattern_sections):
    journey_pattern_sections = []

    for journey_pattern_section_ref in journey_pattern_section_refs:
        for raw_journey_pattern_section in raw_journey_pattern_sections:
            selected_raw_journey_pattern_section = {}

            if raw_journey_pattern_section['@id'] == journey_pattern_section_ref:
                selected_raw_journey_pattern_section = raw_journey_pattern_section

            if len(selected_raw_journey_pattern_section) > 0:
                raw_journey_pattern_timing_links = make_list(
                    selected_raw_journey_pattern_section['JourneyPatternTimingLink']
                )

                journey_pattern_timing_links = []

                for raw_journey_pattern_timing_link in raw_journey_pattern_timing_links:
                    link_from = raw_journey_pattern_timing_link['From']
                    link_to = raw_journey_pattern_timing_link['To']
                    journey_pattern_timing_link = {
                        'from_atco_code': link_from['StopPointRef'],
                        'from_timing_status': link_from.get('TimingStatus', None),
                        'to_atco_code': link_to['StopPointRef'],
                        'to_timing_status': link_to.get('TimingStatus', None),
                        'run_time': raw_journey_pattern_timing_link.get('RunTime', None)
                    }

                    journey_pattern_timing_links.append(
                        journey_pattern_timing_link)

                journey_pattern_sections.append(journey_pattern_timing_links)

    return journey_pattern_sections


def collect_journey_patterns(data_dict, service):
    raw_journey_patterns = make_list(
        service['StandardService']['JourneyPattern'])
    raw_journey_pattern_sections = make_list(
        data_dict['TransXChange']['JourneyPatternSections']['JourneyPatternSection']
    )

    journey_patterns_section_refs_and_info = collect_journey_pattern_section_refs_and_info(
        raw_journey_patterns)

    journey_patterns = []

    for journey_pattern in journey_patterns_section_refs_and_info:
        journey_pattern_section_refs = make_list(
            journey_pattern['journey_pattern_section_refs'])

        processed_journey_pattern = {
            'journey_pattern_sections': process_journey_pattern_sections(
                journey_pattern_section_refs,
                raw_journey_pattern_sections
            ),
            'journey_pattern_info': journey_pattern['journey_pattern_info']
        }

        journey_patterns.append(processed_journey_pattern)

    return journey_patterns


def iterate_through_journey_patterns_and_run_insert_queries(cursor, data_dict, operator_service_id, service):
    journey_patterns = collect_journey_patterns(data_dict, service)

    for journey_pattern in journey_patterns:
        links = []
        journey_pattern_id = insert_into_txc_journey_pattern_table(
            cursor, operator_service_id, journey_pattern['journey_pattern_info']
        )

        for journey_pattern_section in journey_pattern['journey_pattern_sections']:
            for journey_pattern_timing_link in journey_pattern_section:
                links.append(journey_pattern_timing_link)

        insert_into_txc_journey_pattern_link_table(
            cursor, links, journey_pattern_id)


def insert_into_txc_journey_pattern_table(cursor, operator_service_id, journey_pattern_info):
    query = f"INSERT INTO txcJourneyPattern (operatorServiceId, destinationDisplay, direction) VALUES (%s, %s, %s)"

    cursor.execute(
        query,
        [
            operator_service_id,
            journey_pattern_info['destination_display'],
            journey_pattern_info['direction']
        ]
    )

    journey_pattern_id = cursor.lastrowid

    return journey_pattern_id


def insert_into_txc_journey_pattern_link_table(cursor, links, journey_pattern_id):
    values = [
        (
            journey_pattern_id,
            link['from_atco_code'],
            link['from_timing_status'],
            link['to_atco_code'],
            link['to_timing_status'],
            link['run_time'],
            order
        ) for order, link in enumerate(links)
    ]

    query = f"""INSERT INTO txcJourneyPatternLink (journeyPatternId, fromAtcoCode, fromTimingStatus, 
        toAtcoCode, toTimingStatus, runtime, orderInSequence) VALUES (%s, %s, %s, %s, %s, %s, %s)"""

    cursor.executemany(query, values)


def insert_into_txc_operator_service_table(cursor, operator, service, line, region_code, data_source, cloudwatch, logger):
    (
        noc_code,
        start_date,
        operator_short_name,
        service_description,
        service_code,
        origin,
        destination
    ) = extract_data_for_txc_operator_service_table(operator, service)

    query = f"""INSERT INTO txcOperatorLine (nocCode, lineName, startDate, operatorShortName, serviceDescription, serviceCode, regionCode, dataSource, origin, destination)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

    line_name = line.get('LineName', '')

    try:
        cursor.execute(
            query,
            [
                noc_code,
                line_name,
                start_date,
                operator_short_name,
                service_description,
                service_code,
                region_code,
                data_source,
                origin,
                destination
            ]
        )
        operator_service_id = cursor.lastrowid

        return operator_service_id
    except pymysql.IntegrityError as e:
        if e.args[1] == NOC_INTEGRITY_ERROR_MSG:
            logger.info(f"NOC not found in database - '{noc_code}' - '{operator_short_name}'")

            put_metric_data_by_data_source(cloudwatch, data_source, 'InvalidNoc', 1)

            return None

        raise


def check_txc_line_exists(cursor, operator, service, line, data_source, cloudwatch, logger):
    (
        noc_code,
        start_date,
        operator_short_name,
        service_description,
        service_code,
        origin,
        destination
    ) = extract_data_for_txc_operator_service_table(operator, service)

    query = f"""
        SELECT id FROM txcOperatorLine
        WHERE nocCode = %s AND lineName = %s AND serviceCode = %s AND startDate = %s AND dataSource = %s
        LIMIT 1
    """

    line_name = line.get('LineName', '')

    cursor.execute(
        query,
        [
            noc_code,
            line_name,
            service_code,
            start_date,
            data_source
        ]
    )
    result = cursor.fetchone()
    operator_service_id = result[0] if result and len(result) > 0 else None
    
    if operator_service_id:
        logger.info(f"Existing line found - '{noc_code}' - '{line_name}' - '{service_code}' - '{start_date}' - '{data_source}'")

    return operator_service_id


def write_to_database(data_dict, region_code, data_source, key, db_connection, logger, cloudwatch):
    try:
        operators = get_operators(data_dict, data_source, cloudwatch)

        if not operators:
            logger.info(f"No operator data found in TXC file - '{key}'")
            put_metric_data_by_data_source(cloudwatch, data_source, 'NoOperatorData', 1)

            return False

        with db_connection.cursor() as cursor:
            db_connection.begin()

            file_has_nocs = False
            file_has_services = False
            file_has_lines = False
            file_has_useable_data = False

            for operator in operators:
                if 'NationalOperatorCode' not in operator:
                    logger.info(f"No NOC found for operator: '{operator.get('OperatorShortName', '')}', in TXC file - '{key}'")

                    continue

                file_has_nocs = True
                valid_noc = True

                services = get_services_for_operator(data_dict, operator)
                noc = operator.get('NationalOperatorCode', '')

                if not services:
                    logger.info(f"No service data found for operator: '{noc}', in TXC file: '{key}'")

                    continue

                file_has_services = True

                for service in services:
                    if not valid_noc:
                        break

                    lines = get_lines_for_service(service)

                    if not lines:
                        logger.info(f"No line data found for service: '{service.get('ServiceCode', '')}', for operator: '{noc}', in TXC file: '{key}'")

                        continue

                    file_has_lines = True

                    for line in lines:
                        operator_service_id = check_txc_line_exists(
                            cursor, operator, service, line, data_source, cloudwatch, logger)

                        if not operator_service_id:
                            operator_service_id = insert_into_txc_operator_service_table(
                                cursor, operator, service, line, region_code, data_source, cloudwatch, logger)

                        if not operator_service_id:
                            valid_noc = False
                            break
                        
                        iterate_through_journey_patterns_and_run_insert_queries(
                            cursor, data_dict, operator_service_id, service
                        )

                        file_has_useable_data = True

            if not file_has_nocs:
                db_connection.rollback()
                logger.info(f"No NOCs found in TXC file: '{key}'")
                put_metric_data_by_data_source(cloudwatch, data_source, 'NoNOCsInFile', 1)

                return False

            if not file_has_services:
                db_connection.rollback()
                logger.info(f"No service data found in TXC file: '{key}'")
                put_metric_data_by_data_source(cloudwatch, data_source, 'NoServiceDataInFile', 1)

                return False

            if not file_has_lines:
                db_connection.rollback()
                logger.info(f"No line data found in TXC file: '{key}'")
                put_metric_data_by_data_source(cloudwatch, data_source, 'NoLineDataInFile', 1)

                return False

            if not file_has_useable_data:
                db_connection.rollback()
                logger.info(f"No useable data found in TXC file: '{key}'")
                put_metric_data_by_data_source(cloudwatch, data_source, 'NoUseableDataInFile', 1)

                return False

            db_connection.commit()

            return True

    except Exception as e:
        db_connection.rollback()
        logger.error("ERROR! Unexpected error. Could not write to database")
        logger.error(e)

        raise e


def download_from_s3_and_write_to_db(s3, cloudwatch, bucket, key, file_path, db_connection, logger):
    xmltodict_namespaces = {'http://www.transxchange.org.uk/': None}

    s3.download_file(bucket, key, file_path)
    logger.info(f"Downloaded S3 file, '{key}' to '{file_path}'")
    tree = eT.parse(file_path)
    xml_data = tree.getroot()
    xml_string = eT.tostring(xml_data, encoding='utf-8', method='xml')
    data_dict = xmltodict.parse(
        xml_string, process_namespaces=True, namespaces=xmltodict_namespaces
    )
    data_source = key.split('/')[0]
    region_code = key.split('/')[1] if data_source == 'tnds' else None

    logger.info("Starting write to database...")

    written_success = write_to_database(data_dict, region_code, data_source, key, db_connection, logger, cloudwatch)

    if written_success:
        logger.info(
            f"SUCCESS! Succesfully wrote contents of '{key}' from '{bucket}' bucket to database."
        )

        put_metric_data_by_data_source(cloudwatch, data_source, 'FilesProcessedWithData', 1)
    else:
        logger.info(
            f"No data written to database for file '{key}' from '{bucket}' bucket."
        )

        put_metric_data_by_data_source(cloudwatch, data_source, 'FilesProcessedNoData', 1)
