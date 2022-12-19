import os

import xmltodict
import xml.etree.ElementTree as eT

dir_path = os.path.dirname(os.path.realpath(__file__))


def generate_mock_data_dict():
    tree = eT.parse(f"{dir_path}/test_data/mock_txc.xml")
    xml_data = tree.getroot()
    xml_string = eT.tostring(xml_data, encoding="utf-8", method="xml")
    mock_data_dict = xmltodict.parse(
        xml_string,
        process_namespaces=True,
        namespaces={"http://www.transxchange.org.uk/": None},
    )

    return mock_data_dict


def generate_mock_invalid_data_dict():
    tree = eT.parse(f"{dir_path}/test_data/mock_txc_invalid.xml")
    xml_data = tree.getroot()
    xml_string = eT.tostring(xml_data, encoding="utf-8", method="xml")
    mock_data_dict = xmltodict.parse(
        xml_string,
        process_namespaces=True,
        namespaces={"http://www.transxchange.org.uk/": None},
    )

    return mock_data_dict

def generate_mock_ferry_txc_data_dict():
    tree = eT.parse(f"{dir_path}/test_data/mock_ferry_txc.xml")
    xml_data = tree.getroot()
    xml_string = eT.tostring(xml_data, encoding="utf-8", method="xml")
    mock_data_dict = xmltodict.parse(
        xml_string,
        process_namespaces=True,
        namespaces={"http://www.transxchange.org.uk/": None},
    )

    return mock_data_dict