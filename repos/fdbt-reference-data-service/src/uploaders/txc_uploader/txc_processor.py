from typing import Optional

import pymysql
import xmltodict
import xml.etree.ElementTree as eT

NOC_INTEGRITY_ERROR_MSG = "Cannot add or update a child row: a foreign key constraint fails (`fdbt`.`txcOperatorLine`, CONSTRAINT `fk_txcOperatorLine_nocTable_nocCode` FOREIGN KEY (`nocCode`) REFERENCES `nocTable` (`nocCode`))"

def create_unique_line_id(noc, line_name):
    first_part = "UZ"
    second_part = "000"
    return f'{first_part}{second_part}{noc}:{noc}{line_name}'

def put_metric_data_by_data_source(cloudwatch, data_source, metric_name, metric_value):
    cloudwatch.put_metric_data(
        MetricData=[
            {
                "MetricName": metric_name,
                "Dimensions": [
                    {"Name": "By Data Source", "Value": data_source},
                ],
                "Unit": "None",
                "Value": metric_value,
            },
        ],
        Namespace="FDBT/Reference-Data-Uploaders",
    )


def make_list(item):
    if not isinstance(item, list):
        return [item]
    return item


def get_operators(data_dict, data_source, cloudwatch):
    operators = data_dict["TransXChange"].get("Operators", None)

    if operators:
        operator_list = make_list(operators.get("Operator", []))
        licensed_operator_list = make_list(operators.get("LicensedOperator", []))
        return operator_list + licensed_operator_list

    return []


def get_services_for_operator(data_dict, operator):
    if "Services" in data_dict["TransXChange"]:
        services = make_list(data_dict["TransXChange"]["Services"]["Service"])
        services_for_operator = [
            service
            for service in services
            if service["RegisteredOperatorRef"] == operator["@id"]
        ]
        return services_for_operator


def get_lines_for_service(service):
    return make_list(service["Lines"]["Line"])


def extract_data_for_txc_operator_service_table(operator, service, line):
    noc_code = operator.get("NationalOperatorCode")
    start_date = (service.get("OperatingPeriod") or {}).get("StartDate")
    end_date = (service.get("OperatingPeriod") or {}).get("EndDate")
    operator_short_name = operator.get("OperatorShortName")
    inbound_direction_description = (line.get("InboundDescription") or {}).get(
        "Description", ""
    )
    outbound_direction_description = (line.get("OutboundDescription") or {}).get(
        "Description", ""
    )
    service_description = service.get("Description", "")
    service_code = service.get("ServiceCode")
    mode = service.get("Mode", "")
    standard_service = service.get("StandardService")
    origin = standard_service.get("Origin")
    destination = standard_service.get("Destination")

    return (
        noc_code,
        start_date,
        end_date,
        operator_short_name,
        inbound_direction_description,
        outbound_direction_description,
        service_description,
        service_code,
        origin,
        destination,
        mode
    )


def collect_journey_pattern_section_refs_and_info(raw_journey_patterns):
    journey_patterns = []
    for raw_journey_pattern in raw_journey_patterns:
        journey_pattern_info = {
            "direction": raw_journey_pattern["Direction"]
            if "Direction" in raw_journey_pattern
            else None,
            "destination_display": raw_journey_pattern["DestinationDisplay"]
            if "DestinationDisplay" in raw_journey_pattern
            else None,
            "route_ref": raw_journey_pattern["RouteRef"]
            if "RouteRef" in raw_journey_pattern
            else None,
            "journey_pattern_ref": raw_journey_pattern["@id"]
            if "@id" in raw_journey_pattern
            else None,
        }

        raw_journey_pattern_section_refs = raw_journey_pattern[
            "JourneyPatternSectionRefs"
        ]
        journey_patterns.append(
            {
                "journey_pattern_info": journey_pattern_info,
                "journey_pattern_section_refs": make_list(
                    raw_journey_pattern_section_refs
                ),
            }
        )

    return journey_patterns


def process_journey_pattern_sections(
    journey_pattern_section_refs: list, raw_journey_pattern_sections: list
):
    journey_pattern_sections = []
    for journey_pattern_section_ref in journey_pattern_section_refs:
        for raw_journey_pattern_section in raw_journey_pattern_sections:
            selected_raw_journey_pattern_section = {}

            if raw_journey_pattern_section["@id"] == journey_pattern_section_ref:
                selected_raw_journey_pattern_section = raw_journey_pattern_section

            if len(selected_raw_journey_pattern_section) > 0:
                raw_journey_pattern_timing_links = make_list(
                    selected_raw_journey_pattern_section.get("JourneyPatternTimingLink")
                )
                journey_pattern_timing_links = []
                for raw_journey_pattern_timing_link in raw_journey_pattern_timing_links:
                    if raw_journey_pattern_timing_link:
                        link_from = raw_journey_pattern_timing_link.get("From")
                        link_to = raw_journey_pattern_timing_link.get("To")
                        journey_pattern_timing_link = {
                            "from_atco_code": link_from["StopPointRef"],
                            "from_timing_status": link_from.get("TimingStatus", None),
                            "from_sequence_number": link_from.get("@SequenceNumber"),
                            "to_atco_code": link_to["StopPointRef"],
                            "to_timing_status": link_to.get("TimingStatus", None),
                            "run_time": raw_journey_pattern_timing_link.get(
                                "RunTime", None
                            ),
                            "to_sequence_number": link_to.get("@SequenceNumber"),
                            "route_link_ref": raw_journey_pattern_timing_link.get(
                                "RouteLinkRef", None
                            ),
                        }
                        journey_pattern_timing_links.append(journey_pattern_timing_link)

                journey_pattern_sections.append(journey_pattern_timing_links)

    return journey_pattern_sections


def collect_journey_patterns(data: dict, service: dict):
    raw_journey_patterns = make_list(service["StandardService"]["JourneyPattern"])
    raw_journey_pattern_sections = make_list(
        data["TransXChange"]["JourneyPatternSections"]["JourneyPatternSection"]
    )

    journey_patterns_section_refs_and_info = (
        collect_journey_pattern_section_refs_and_info(raw_journey_patterns)
    )

    journey_patterns = []
    for journey_pattern in journey_patterns_section_refs_and_info:
        journey_pattern_section_refs = make_list(
            journey_pattern["journey_pattern_section_refs"]
        )
        processed_journey_pattern = {
            "journey_pattern_sections": process_journey_pattern_sections(
                journey_pattern_section_refs, raw_journey_pattern_sections
            ),
            "journey_pattern_info": journey_pattern["journey_pattern_info"],
            "journey_pattern_section_refs": journey_pattern_section_refs,
        }
        journey_patterns.append(processed_journey_pattern)

    return journey_patterns

def check_journey_pattern_exists(
    cursor,
    op_service_id,
    destination_display,
    direction,
    route_ref,
    joined_section_refs,
    logger,
):
    query = """
        SELECT id FROM txcJourneyPatternNew
        WHERE operatorServiceId <=> %s AND destinationDisplay <=> %s AND direction
        LIMIT 1
    """

    cursor.execute(
        query,
        [
            op_service_id,
            destination_display,
            direction,
            route_ref,
            joined_section_refs,
        ],
    )
    result = cursor.fetchone()

    journey_pattern_id = result[0] if result and len(result) > 0 else None
    if journey_pattern_id:
        logger.info(
            f"Existing journey pattern found - '{op_service_id}' - '{destination_display}' - '{direction}' - '{route_ref}' - '{joined_section_refs}'"
        )

    return True if journey_pattern_id else False

def iterate_through_journey_patterns_and_run_insert_queries(
    cursor,
    data: dict,
    operator_service_id: str,
    service: dict,
    vehicle_journeys: list,
    logger,
):
    journey_patterns = collect_journey_patterns(data, service)

    vehicle_journey_journey_pattern_refs = [
        vehicle_journey["journey_pattern_ref"] for vehicle_journey in vehicle_journeys
    ]

    for journey_pattern in journey_patterns:
        journey_pattern_info = journey_pattern["journey_pattern_info"]

        if (
            journey_pattern_info["journey_pattern_ref"]
            not in vehicle_journey_journey_pattern_refs
        ):
            continue

        journey_pattern_section_refs: list = journey_pattern[
            "journey_pattern_section_refs"
        ]
        sorted_journey_pattern_section_refs = sorted(journey_pattern_section_refs)

        joined_section_refs = "".join(sorted_journey_pattern_section_refs)

        if check_journey_pattern_exists(
            cursor,
            operator_service_id,
            journey_pattern_info["destination_display"],
            journey_pattern_info["direction"],
            journey_pattern_info["route_ref"],
            joined_section_refs,
            logger,
        ):
            continue

        journey_pattern_id = insert_into_txc_journey_pattern_table(
            cursor, operator_service_id, journey_pattern_info
        )

        links = []
        stop_codes = set()
        for journey_pattern_section in journey_pattern["journey_pattern_sections"]:
            for journey_pattern_timing_link in journey_pattern_section:
                stop_codes.add(journey_pattern_timing_link["from_atco_code"])
                stop_codes.add(journey_pattern_timing_link["to_atco_code"])
                links.append(journey_pattern_timing_link)

        insert_into_txc_journey_pattern_link_table(cursor, links, journey_pattern_id)

def insert_into_txc_journey_pattern_table(
    cursor,
    operator_service_id,
    journey_pattern_info
):
    query = "INSERT INTO txcJourneyPatternNew (operatorServiceId, destinationDisplay, direction) VALUES (%s, %s, %s)"

    cursor.execute(
        query,
        [
            operator_service_id,
            journey_pattern_info["destination_display"],
            journey_pattern_info["direction"]
        ],
    )
    journey_pattern_id = cursor.lastrowid
    return journey_pattern_id

def insert_into_txc_journey_pattern_link_table(cursor, links, journey_pattern_id):
    values = [
        (
            journey_pattern_id,
            link["from_atco_code"],
            link["from_timing_status"],
            link["from_sequence_number"],
            link["to_atco_code"],
            link["to_timing_status"],
            link["to_sequence_number"],
            link["run_time"],
            order,
        )
        for order, link in enumerate(links)
    ]
    query = """INSERT INTO txcJourneyPatternLinkNew (journeyPatternId, fromAtcoCode, fromTimingStatus, fromSequenceNumber,
        toAtcoCode, toTimingStatus, toSequenceNumber, runtime, orderInSequence) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    cursor.executemany(query, values)


def insert_into_txc_operator_service_table(
    cursor,
    operator,
    service,
    line,
    region_code,
    data_source,
    cloudwatch,
    logger,
):
    (
        noc_code,
        start_date,
        end_date,
        operator_short_name,
        inbound_direction_description,
        outbound_direction_description,
        service_description,
        service_code,
        origin,
        destination,
        mode,
    ) = extract_data_for_txc_operator_service_table(operator, service, line)

    query = """INSERT INTO txcOperatorLineNew (nocCode, lineName, lineId, startDate, endDate, operatorShortName, inboundDirectionDescription, outboundDirectionDescription, serviceDescription, serviceCode, regionCode, dataSource, origin, destination, mode)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

    line_id = line.get("@id", "")
    line_name = line.get("LineName", "")

    if not line.get("@id") or (mode != "bus" and data_source == "tnds"):
        line_id = create_unique_line_id(noc_code, line_name)

    try:
        cursor.execute(
            query,
            [
                noc_code,
                line_name,
                line_id,
                start_date,
                end_date,
                operator_short_name,
                inbound_direction_description,
                outbound_direction_description,
                service_description,
                service_code,
                region_code,
                data_source,
                origin,
                destination,
                mode
            ],
        )
        operator_service_id = cursor.lastrowid
        return operator_service_id
    except pymysql.IntegrityError as e:
        if e.args[1] == NOC_INTEGRITY_ERROR_MSG:
            logger.info(
                f"NOC not found in database - '{noc_code}' - '{operator_short_name}'"
            )
            put_metric_data_by_data_source(cloudwatch, data_source, "InvalidNoc", 1)
            return None
        raise e


def check_txc_line_exists(
    cursor, operator, service, line, data_source, cloudwatch, logger
):
    (
        noc_code,
        start_date,
        end_date,
        operator_short_name,
        inbound_direction_description,
        outbound_direction_description,
        service_description,
        service_code,
        origin,
        destination,
        mode
    ) = extract_data_for_txc_operator_service_table(operator, service, line)

    query = f"""
        SELECT id FROM txcOperatorLineNew
        WHERE nocCode = %s AND lineName = %s AND serviceCode = %s AND startDate = %s AND endDate = %s AND dataSource = %s
        LIMIT 1
    """

    line_name = line.get("LineName", "")
    cursor.execute(
        query, [noc_code, line_name, service_code, start_date, end_date, data_source]
    )
    result = cursor.fetchone()

    operator_service_id = result[0] if result and len(result) > 0 else None
    if operator_service_id:
        logger.info(
            f"Existing line found - '{noc_code}' - '{line_name}' - '{service_code}' - '{start_date}' - '{data_source}'"
        )
    return operator_service_id


def check_file_has_usable_data(data: dict, service: dict) -> bool:
    def service_has_journey_patterns(service: dict) -> bool:
        return "JourneyPattern" in service.get("StandardService")  # type: ignore

    def data_has_journey_pattern_sections(data: dict) -> bool:
        return "JourneyPatternSections" in data.get("TransXChange")  # type: ignore

    def journey_pattern_sections_has_journey_pattern_section(data: dict) -> bool:
        return "JourneyPatternSection" in data.get("TransXChange", {}).get("JourneyPatternSections")  # type: ignore

    def all_journey_pattern_sections_are_not_empty(data: dict, service: dict) -> bool:
        journey_patterns = collect_journey_patterns(data, service)
        for jp in journey_patterns:
            for jps in jp.get("journey_pattern_sections"):
                # if the journey_pattern_section is empty
                if not len(jps):
                    return False
        return True

    return (
        service_has_journey_patterns(service)
        and data_has_journey_pattern_sections(data)
        and journey_pattern_sections_has_journey_pattern_section(data)
        and all_journey_pattern_sections_are_not_empty(data, service)
    )

def get_vehicle_journeys(data_dict):
    if (
        "VehicleJourneys" in data_dict["TransXChange"]
        and data_dict["TransXChange"]["VehicleJourneys"] is not None
    ):
        vehicle_journeys = make_list(
            data_dict["TransXChange"]["VehicleJourneys"]["VehicleJourney"]
        )

        return vehicle_journeys

def collect_vehicle_journey(vehicle):
    vehicle_journey_info = {
        "vehicle_journey_code": vehicle["VehicleJourneyCode"]
        if "VehicleJourneyCode" in vehicle
        else None,
        "service_ref": vehicle["ServiceRef"] if "ServiceRef" in vehicle else None,
        "line_ref": vehicle["LineRef"] if "LineRef" in vehicle else None,
        "journey_pattern_ref": vehicle["JourneyPatternRef"]
        if "JourneyPatternRef" in vehicle
        else None,
    }

    return vehicle_journey_info

def format_vehicle_journeys(vehicle_journeys: list, line_id: str):
    vehicle_journey_refs = [
        journey["VehicleJourneyRef"]
        for journey in vehicle_journeys
        if journey["LineRef"] == line_id
        and "JourneyPatternRef" not in journey
        and "VehicleJourneyRef" in journey
        and "LineRef" in journey
    ]
    vehicle_journeys_for_line = [
        journey
        for journey in vehicle_journeys
        if "JourneyPatternRef" in journey
        and (
            ("LineRef" in journey and journey["LineRef"] == line_id)
            or (
                "VehicleJourneyCode" in journey
                and journey["VehicleJourneyCode"] in vehicle_journey_refs
            )
        )
    ]

    vehicle_journeys_data = []
    journey_pattern_count = {}

    for vehicle_journey in vehicle_journeys_for_line:
        journey_pattern_ref = (
            vehicle_journey["JourneyPatternRef"]
            if "JourneyPatternRef" in vehicle_journey
            else None
        )

        if journey_pattern_ref not in journey_pattern_count:
            if journey_pattern_ref is not None:
                journey_pattern_count[journey_pattern_ref] = 1
        else:
            journey_pattern_count[journey_pattern_ref] += 1

        vehicle_journeys_data.append(collect_vehicle_journey(vehicle_journey))

    return vehicle_journeys_data

def write_to_database(
    data: dict,
    region_code: Optional[str],
    data_source: str,
    key: str,
    db_connection,
    logger,
    cloudwatch,
):
    try:
        operators = get_operators(data, data_source, cloudwatch)

        if not operators:
            logger.info(f"No operator data found in TXC file: '{key}'")
            put_metric_data_by_data_source(cloudwatch, data_source, "NoOperatorData", 1)

            return False

        with db_connection.cursor() as cursor:
            file_has_nocs: bool = False
            file_has_services: bool = False
            file_has_lines: bool = False
            file_has_useable_data: bool = False
            file_has_vehicle_journeys: bool = False

            for operator in operators:
                if "NationalOperatorCode" not in operator:
                    logger.info(
                        f"No NOC found for operator: '{operator.get('OperatorShortName', '')}', in TXC file: '{key}'"
                    )
                    continue
                file_has_nocs = True
                valid_noc = True

                services = get_services_for_operator(data, operator)
                vehicle_journeys = get_vehicle_journeys(data)
                noc = operator.get("NationalOperatorCode", "")
                if not services:
                    logger.info(
                        f"No service data found for operator: '{noc}', in TXC file: '{key}'"
                    )
                    continue
                file_has_services = True

                if not vehicle_journeys:
                    logger.info(
                        f"No vehicle journey data found for operator: '{noc}', in TXC file: '{key}'"
                    )
                    continue

                file_has_vehicle_journeys = True

                for service in services:
                    if not valid_noc:
                        break

                    lines = get_lines_for_service(service)
                    if not lines:
                        logger.info(
                            f"No line data found for service: '{service.get('ServiceCode', '')}', for operator: '{noc}', in TXC file: '{key}'"
                        )
                        continue
                    file_has_lines = True

                    operator_service_id = None

                    for line in lines:
                        operator_service_id = check_txc_line_exists(
                            cursor,
                            operator,
                            service,
                            line,
                            data_source,
                            cloudwatch,
                            logger,
                        )
                        if not operator_service_id:
                            operator_service_id = (
                                insert_into_txc_operator_service_table(
                                    cursor,
                                    operator,
                                    service,
                                    line,
                                    region_code,
                                    data_source,
                                    cloudwatch,
                                    logger,
                                )
                            )
                        if not operator_service_id:
                            valid_noc = False
                            break

                        line_id = line["@id"]

                        (
                            vehicle_journeys_for_line
                        ) = format_vehicle_journeys(vehicle_journeys, line_id)

                        file_has_useable_data = check_file_has_usable_data(
                            data, service
                        )

                        if file_has_useable_data:
                            iterate_through_journey_patterns_and_run_insert_queries(
                                cursor,
                                data,
                                operator_service_id,
                                service,
                                vehicle_journeys_for_line,
                                logger,
                            )

            if not file_has_nocs:
                db_connection.rollback()
                logger.info(f"No NOCs found in TXC file: '{key}'")
                put_metric_data_by_data_source(
                    cloudwatch, data_source, "NoNOCsInFile", 1
                )
                return False

            if not file_has_services:
                db_connection.rollback()
                logger.info(f"No service data found in TXC file: '{key}'")
                put_metric_data_by_data_source(
                    cloudwatch, data_source, "NoServiceDataInFile", 1
                )
                return False

            if not file_has_vehicle_journeys:
                db_connection.rollback()
                logger.info(f"No vehicle journeys data found in TXC file: '{key}'")
                put_metric_data_by_data_source(
                    cloudwatch, data_source, "NoVehicleJourneysDataInFile", 1
                )
                return False

            if not file_has_lines:
                db_connection.rollback()
                logger.info(f"No line data found in TXC file: '{key}'")
                put_metric_data_by_data_source(
                    cloudwatch, data_source, "NoLineDataInFile", 1
                )
                return False

            if not file_has_useable_data:
                db_connection.rollback()
                logger.info(f"No useable data found in TXC file: '{key}'")
                put_metric_data_by_data_source(
                    cloudwatch, data_source, "NoUseableDataInFile", 1
                )
                return False

            db_connection.commit()
            return True

    except Exception as e:
        db_connection.rollback()
        logger.error(
            f"ERROR! Unexpected error. Could not write to database. Error: {e}"
        )
        raise e

def download_from_s3_and_write_to_db(
    s3, cloudwatch, bucket, key, file_path, db_connection, logger
):
    s3.download_file(bucket, key, file_path)
    logger.info(f"Downloaded S3 file, '{key}' to '{file_path}'")

    tree = eT.parse(file_path)
    xml_data = tree.getroot()
    xml_string = eT.tostring(xml_data, encoding="utf-8", method="xml")
    xmltodict_namespaces = {"http://www.transxchange.org.uk/": None}
    data_dict = xmltodict.parse(
        xml_string, process_namespaces=True, namespaces=xmltodict_namespaces
    )

    data_source = key.split("/")[0]
    region_code = key.split("/")[1] if data_source == "tnds" else None

    logger.info("Starting write to database...")
    written_success = write_to_database(
        data_dict, region_code, data_source, key, db_connection, logger, cloudwatch
    )

    if written_success:
        logger.info(
            f"SUCCESS! Successfully wrote contents of '{key}' from '{bucket}' bucket to database."
        )

    else:
        logger.info(
            f"No data written to database for file '{key}' from '{bucket}' bucket."
        )
