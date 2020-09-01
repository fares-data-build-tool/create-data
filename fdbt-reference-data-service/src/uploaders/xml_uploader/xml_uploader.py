import xmltodict
import xml.etree.ElementTree as eT


def make_list(item):
    if not isinstance(item, list):
        return [item]

    return item


def get_operators(data_dict):
    operators = data_dict['TransXChange']['Operators']['Operator']

    return make_list(operators)


def get_services_for_operator(data_dict, operator):
    services = make_list(data_dict['TransXChange']['Services']['Service'])
    services_for_operator = [
        service for service in services if service['RegisteredOperatorRef'] == operator['@id']]

    return services_for_operator


def get_lines_for_service(service):
    return make_list(service['Lines']['Line'])


def extract_data_for_tnds_operator_service_table(operator, service):
    noc_code = operator['NationalOperatorCode']
    start_date = service['OperatingPeriod']['StartDate']
    operator_short_name = operator['OperatorShortName']
    service_description = service['Description'] if 'Description' in service else ''
    service_code = service['ServiceCode'] if 'ServiceCode' in service else None

    return noc_code, start_date, operator_short_name, service_description, service_code


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
                    journey_pattern_timing_link = {
                        'from_atco_code': raw_journey_pattern_timing_link['From']['StopPointRef'],
                        'from_timing_status': raw_journey_pattern_timing_link['From']['TimingStatus'],
                        'to_atco_code': raw_journey_pattern_timing_link['To']['StopPointRef'],
                        'to_timing_status': raw_journey_pattern_timing_link['To']['TimingStatus'],
                        'run_time': raw_journey_pattern_timing_link['RunTime']
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
        journey_pattern_id = insert_into_tnds_journey_pattern_table(
            cursor, operator_service_id, journey_pattern['journey_pattern_info']
        )

        for journey_pattern_section in journey_pattern['journey_pattern_sections']:
            for journey_pattern_timing_link in journey_pattern_section:
                links.append(journey_pattern_timing_link)

        insert_into_tnds_journey_pattern_link_table(
            cursor, links, journey_pattern_id)


def insert_into_tnds_journey_pattern_table(cursor, operator_service_id, journey_pattern_info):
    query = "INSERT INTO tndsJourneyPattern (operatorServiceId, destinationDisplay, direction) VALUES (%s, %s, %s)"

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


def insert_into_tnds_journey_pattern_link_table(cursor, links, journey_pattern_id):
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

    query = """INSERT INTO tndsJourneyPatternLink (journeyPatternId, fromAtcoCode, fromTimingStatus, 
        toAtcoCode, toTimingStatus, runtime, orderInSequence) VALUES (%s, %s, %s, %s, %s, %s, %s)"""

    cursor.executemany(query, values)


def insert_into_tnds_operator_service_table(cursor, operator, service, line):
    (
        noc_code,
        start_date,
        operator_short_name,
        service_description,
        service_code
    ) = extract_data_for_tnds_operator_service_table(operator, service)

    query = """INSERT INTO tndsOperatorService (nocCode, lineName, startDate, operatorShortName, serviceDescription, serviceCode) 
        VALUES (%s, %s, %s, %s, %s, %s)"""

    cursor.execute(
        query,
        [
            noc_code,
            line['LineName'],
            start_date,
            operator_short_name,
            service_description,
            service_code,
        ]
    )
    operator_service_id = cursor.lastrowid

    return operator_service_id


def write_to_database(data_dict, db_connection, logger):
    try:
        operators = get_operators(data_dict)

        with db_connection.cursor() as cursor:
            db_connection.begin()

            for operator in operators:
                if 'NationalOperatorCode' not in operator:
                    logger.info('Operator not in required format, ignoring...')
                    continue

                services = get_services_for_operator(data_dict, operator)

                for service in services:
                    lines = get_lines_for_service(service)

                    for line in lines:
                        operator_service_id = insert_into_tnds_operator_service_table(
                            cursor, operator, service, line)
                        iterate_through_journey_patterns_and_run_insert_queries(
                            cursor, data_dict, operator_service_id, service
                        )

            db_connection.commit()

    except Exception as e:
        db_connection.rollback()
        logger.error("ERROR! Unexpected error. Could not write to database")
        logger.error(e)

        raise e


def download_from_s3_and_write_to_db(s3, bucket, key, file_path, db_connection, logger):
    xmltodict_namespaces = {'http://www.transxchange.org.uk/': None}

    s3.download_file(bucket, key, file_path)
    logger.info("Downloaded S3 file, '{}' to '{}'".format(key, file_path))
    tree = eT.parse(file_path)
    xml_data = tree.getroot()
    xml_string = eT.tostring(xml_data, encoding='utf-8', method='xml')
    data_dict = xmltodict.parse(
        xml_string, process_namespaces=True, namespaces=xmltodict_namespaces
    )

    logger.info("Starting write to database...")

    write_to_database(data_dict, db_connection, logger)

    logger.info(
        "SUCCESS! Succesfully wrote contents of '{}' from '{}' bucket to database.".format(
            key,
            bucket
        )
    )
