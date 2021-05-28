import os
import xmltodict
import xml.etree.ElementTree as eT

dir_path = os.path.dirname(os.path.realpath(__file__))
file_path = dir_path + '/test_data/mock_txc.xml'


def generate_mock_data_dict():
    tree = eT.parse(file_path)
    xml_data = tree.getroot()
    xml_string = eT.tostring(xml_data, encoding='utf-8', method='xml')
    mock_data_dict = xmltodict.parse(xml_string, process_namespaces=True, namespaces={'http://www.transxchange.org.uk/': None})

    return mock_data_dict
