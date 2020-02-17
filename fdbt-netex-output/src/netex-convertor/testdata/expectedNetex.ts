export default {
    PublicationDelivery: {
        version: '1.1',
        'xsi:schemaLocation': 'http://www.netex.org.uk/netex ../NeTEx_publication.xsd',
        xmlns: 'http://www.netex.org.uk/netex',
        'xmlns:siri': 'http://www.siri.org.uk/siri',
        'xmlns:gml': 'http://www.opengis.net/gml/3.2',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        Description: 'Example  of simple point to point fares',
        dataObjects: {
            CompositeFrame: [
                {
                    version: '1.0',
                    id: 'operator@Products@Trip@Line_1',
                    dataSourceRef: 'op:operator',
                    responsibilitySetRef: 'tariffs',
                    ValidBetween: {
                        FromDate: {},
                        ToDate: {},
                    },
                    Name: {},
                    Description: {},
                    TypeOfFrameRef: {
                        ref: 'fxc:UK_Bus_tariff_profile@composite',
                        version: 'fxc:v1.0',
                    },
                    codespaces: {
                        CodespaceRef: [
                            {
                                ref: 'napt',
                            },
                            {
                                ref: 'naptStop',
                            },
                            {
                                ref: 'nptgUkLocality',
                            },
                            {
                                ref: 'nptgUkAdministrativeArea',
                            },
                            {
                                ref: 'noc',
                            },
                            {
                                ref: 'op',
                            },
                        ],
                    },
                    FrameDefaults: {
                        DefaultCodespaceRef: {
                            ref: 'op',
                        },
                        DefaultDataSourceRef: {
                            ref: 'op:operator',
                            version: '1.0',
                        },
                        DefaultCurrency: 'GBP',
                    },
                    frames: {
                        ResourceFrame: {
                            version: '1.0',
                            id: 'operator',
                            dataSourceRef: 'op:operator',
                            responsibilitySetRef: 'network_data',
                            Name: 'Operator specific common resources',
                            TypeOfFrameRef: {
                                ref: 'fxc:UK_Bus_tariff_profile@operator_resources',
                                version: 'fxc:v1.0',
                            },
                            codespaces: {
                                Codespace: {
                                    id: 'op',
                                    Xmlns: 'op',
                                    XmlnsUrl: 'www.iwbus.co.uk',
                                    Description: 'Operator data',
                                },
                            },
                            dataSources: {
                                DataSource: {
                                    id: 'operator',
                                    version: '1.0',
                                    Email: 'email@iwbus.co.uk',
                                },
                            },
                            responsibilitySets: {
                                ResponsibilitySet: [
                                    {
                                        version: '1.0',
                                        id: 'tariffs',
                                        Name: 'Operator Tariffs',
                                        roles: {
                                            ResponsibilityRoleAssignment: {
                                                version: '1.0',
                                                id: 'tariff_data@creates',
                                                DataRoleType: 'creates',
                                                StakeholderRoleType: 'FareManagement',
                                                ResponsibleOrganisationRef: {
                                                    ref: 'noc:123123',
                                                    version: '1.0',
                                                    $t: 'IWBus Transport',
                                                },
                                            },
                                        },
                                    },
                                    {
                                        version: '1.0',
                                        id: 'network_data',
                                        Name: 'Operator data',
                                        roles: {
                                            ResponsibilityRoleAssignment: {
                                                version: '1.0',
                                                id: 'network_data@creates',
                                                DataRoleType: 'creates',
                                                StakeholderRoleType: 'Planning',
                                                ResponsibleOrganisationRef: {
                                                    ref: 'noc:123123',
                                                    version: '1.0',
                                                    $t: 'IWBus Transport',
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                            typesOfValue: {
                                ValueSet: {
                                    version: '1.0',
                                    id: 'Branding',
                                    classOfValues: 'Branding',
                                    Name: 'Operator Branding',
                                    values: {
                                        Branding: {
                                            version: '1.0',
                                            id: '123123@brand',
                                            Name: {},
                                            Url: {},
                                        },
                                    },
                                },
                            },
                            organisations: {
                                Operator: {
                                    version: '1.0',
                                    id: 'noc:123123',
                                    PublicCode: 'TLCT',
                                    Name: 'IWBus Transport',
                                    ShortName: 'IWBus',
                                    TradingName: 'IWBus Transport Ltd',
                                    ContactDetails: {
                                        Phone: '0113 111 1111',
                                    },
                                    OrganisationType: 'operator',
                                    Address: {
                                        Street: 'Apsley Hpuse, 1 Wellington Street, Leeds, LS1 AAA',
                                        Town: {},
                                        PostCode: {},
                                        PostalRegion: {},
                                    },
                                    PrimaryMode: 'bus',
                                },
                            },
                        },
                        ServiceFrame: {
                            version: '1.0',
                            id: 'operator@Network@Line_354',
                            dataSourceRef: 'op:operator',
                            responsibilitySetRef: 'tariffs',
                            Name: {},
                            Description:
                                'This frame contains the stop and line definitions for the service. It could also be exchanged separately.',
                            TypeOfFrameRef: {
                                ref: 'fxc:UK_Bus_tariff_profile@service_network@line',
                                version: 'fxc:v1.0',
                            },
                            lines: {
                                Line: {
                                    version: '1.0',
                                    id: '354',
                                    Name: 'IWBus Transport 354',
                                    Description: 'Test Description',
                                    PublicCode: '354',
                                    PrivateCode: {
                                        type: 'noc',
                                        $t: 'TLCT_354',
                                    },
                                    OperatorRef: {
                                        version: '1.0',
                                        ref: 'noc:123123',
                                        $t: 'TLCT',
                                    },
                                    LineType: 'local',
                                },
                            },
                            scheduledStopPoints: {
                                ScheduledStopPoint: [
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA03623',
                                        Name: 'Queenswood Grove',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00077',
                                        Name: 'Kingsthorpe',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00928',
                                        Name: 'Green Lane',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00075',
                                        Name: 'Green Lane',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00076',
                                        Name: 'Harold Court',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00809',
                                        Name: 'Kingsthorpe',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00870',
                                        Name: 'Queenswood Grove',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00359',
                                        Name: 'Mattison Way',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00358',
                                        Name: 'Mattison Way',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00357',
                                        Name: 'Campbell Avenue',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA01666',
                                        Name: 'Campbell Avenue',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA01606',
                                        Name: 'Collingwood Avenue',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA01611',
                                        Name: 'Hob Moor Drive',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA01609',
                                        Name: 'Holly Bank Road',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA03583',
                                        Name: 'Barbara Grove',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00195',
                                        Name: 'Holgate Hill',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00152',
                                        Name: 'Blossom Street',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00141',
                                        Name: 'Rail Station',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00149',
                                        Name: 'Blossom Street',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00136',
                                        Name: 'Rail Station',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00103',
                                        Name: 'Piccadilly',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00100',
                                        Name: 'Low Ousegate',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00924',
                                        Name: 'Rougier Street',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00099',
                                        Name: 'Micklegate',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                    {
                                        version: 'any',
                                        id: 'naptan:3290YYA00107',
                                        Name: 'Merchantgate',
                                        TopographicPlaceView: {
                                            TopographicPlaceRef: {
                                                ref: 'nptgUkLocality:E0026633',
                                                version: '0',
                                            },
                                            Name: 'Bewbush',
                                            QualifierName: 'West Sussex',
                                        },
                                    },
                                ],
                            },
                        },
                        FareFrame: [
                            {
                                version: '1.0',
                                id: 'operator@Network@Line_354',
                                dataSourceRef: 'op:operator',
                                responsibilitySetRef: 'network_data',
                                Name: 'IWBus Transport 354',
                                TypeOfFrameRef: {
                                    ref: 'fxc:UK_Bus_tariff_profile@fare_network',
                                    version: 'fxc:v1.0',
                                },
                                fareZones: {
                                    FareZone: [
                                        {
                                            version: '1.0',
                                            id: 'fs@Acomb_Green_Lane',
                                            Name: 'Acomb Green Lane',
                                            members: {
                                                stopPoints: [
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA03623',
                                                            version: 'any',
                                                            $t: 'Queenswood Grove, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00077',
                                                            version: 'any',
                                                            $t: 'Kingsthorpe, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00928',
                                                            version: 'any',
                                                            $t: 'Green Lane, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00075',
                                                            version: 'any',
                                                            $t: 'Green Lane, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00076',
                                                            version: 'any',
                                                            $t: 'Harold Court, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00809',
                                                            version: 'any',
                                                            $t: 'Kingsthorpe, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00870',
                                                            version: 'any',
                                                            $t: 'Queenswood Grove, Bewbush',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'fs@Mattison_Way',
                                            Name: 'Mattison Way',
                                            members: {
                                                stopPoints: [
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00359',
                                                            version: 'any',
                                                            $t: 'Mattison Way, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00358',
                                                            version: 'any',
                                                            $t: 'Mattison Way, Bewbush',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'fs@Nursery_Drive',
                                            Name: 'Nursery Drive',
                                            members: {
                                                stopPoints: [
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00357',
                                                            version: 'any',
                                                            $t: 'Campbell Avenue, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA01666',
                                                            version: 'any',
                                                            $t: 'Campbell Avenue, Bewbush',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'fs@Holl_Bank/Beech_Ave',
                                            Name: 'Holl Bank/Beech Ave',
                                            members: {
                                                stopPoints: [
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA01606',
                                                            version: 'any',
                                                            $t: 'Collingwood Avenue, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA01611',
                                                            version: 'any',
                                                            $t: 'Hob Moor Drive, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA01609',
                                                            version: 'any',
                                                            $t: 'Holly Bank Road, Bewbush',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'fs@Cambridge_Street_(York)',
                                            Name: 'Cambridge Street (York)',
                                            members: {
                                                stopPoints: [
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA03583',
                                                            version: 'any',
                                                            $t: 'Barbara Grove, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00195',
                                                            version: 'any',
                                                            $t: 'Holgate Hill, Bewbush',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'fs@Blossom_Street',
                                            Name: 'Blossom Street',
                                            members: {
                                                stopPoints: [
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00152',
                                                            version: 'any',
                                                            $t: 'Blossom Street, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00141',
                                                            version: 'any',
                                                            $t: 'Rail Station, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00149',
                                                            version: 'any',
                                                            $t: 'Blossom Street, Bewbush',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'fs@Rail_Station',
                                            Name: 'Rail Station',
                                            members: {
                                                stopPoints: {
                                                    ScheduledStopPointRef: {
                                                        ref: 'naptan:3290YYA00136',
                                                        version: 'any',
                                                        $t: 'Rail Station, Bewbush',
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'fs@Piccadilly_(York)',
                                            Name: 'Piccadilly (York)',
                                            members: {
                                                stopPoints: [
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00103',
                                                            version: 'any',
                                                            $t: 'Piccadilly, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00100',
                                                            version: 'any',
                                                            $t: 'Low Ousegate, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00924',
                                                            version: 'any',
                                                            $t: 'Rougier Street, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00099',
                                                            version: 'any',
                                                            $t: 'Micklegate, Bewbush',
                                                        },
                                                    },
                                                    {
                                                        ScheduledStopPointRef: {
                                                            ref: 'naptan:3290YYA00107',
                                                            version: 'any',
                                                            $t: 'Merchantgate, Bewbush',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                version: '1.0',
                                id: 'operator@Products@Trip@Line_354',
                                dataSourceRef: 'op:operator',
                                responsibilitySetRef: 'tariffs',
                                Name: 'IWBus Transport 354',
                                TypeOfFrameRef: {
                                    ref: 'fxc:UK_Bus_tariff_profile@products@by_Line',
                                    versionRef: 'fxc:v1.0',
                                },
                                PricingParameterSet: {},
                                priceGroups: {
                                    PriceGroup: [
                                        {
                                            version: '1.0',
                                            id: 'price_band_1.10',
                                            members: {
                                                GeographicalIntervalPrice: {
                                                    version: '1.0',
                                                    id: 'price_band_1.10@adult',
                                                    Amount: '1.10',
                                                },
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'price_band_1.70',
                                            members: {
                                                GeographicalIntervalPrice: {
                                                    version: '1.0',
                                                    id: 'price_band_1.70@adult',
                                                    Amount: '1.70',
                                                },
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'price_band_1.00',
                                            members: {
                                                GeographicalIntervalPrice: {
                                                    version: '1.0',
                                                    id: 'price_band_1.00@adult',
                                                    Amount: '1.00',
                                                },
                                            },
                                        },
                                    ],
                                },
                                tariffs: {
                                    Tariff: {
                                        version: '1.0',
                                        id: 'Tariff@single@Line_354',
                                        validityConditions: {
                                            ValidBetween: {
                                                FromDate: '2020-03-16T00:00:00.000Z',
                                                ToDate: '2119-03-16T00:00:00.000Z',
                                            },
                                        },
                                        Name: 'IWBus Transport 354 - Single Fares',
                                        documentLinks: {},
                                        OperatorRef: {
                                            version: '1.0',
                                            ref: 'noc:123123',
                                            $t: 'TLCT',
                                        },
                                        LineRef: {
                                            version: '1.0',
                                            ref: 'Line_354',
                                        },
                                        fareStructureElements: {
                                            FareStructureElement: [
                                                {
                                                    version: '1.0',
                                                    id: 'Tariff@single@lines',
                                                    Name: 'O/D pairs for 354',
                                                    distanceMatrixElements: {
                                                        DistanceMatrixElement: [
                                                            {
                                                                version: '1.0',
                                                                id: 'Acomb_Green_Lane+Mattison_Way',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Acomb_Green_Lane',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Mattison_Way',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Acomb_Green_Lane+Nursery_Drive',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Acomb_Green_Lane',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Nursery_Drive',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Acomb_Green_Lane+Holl_Bank/Beech_Ave',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Acomb_Green_Lane',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Holl_Bank/Beech_Ave',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Acomb_Green_Lane+Cambridge_Street',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Acomb_Green_Lane',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Cambridge_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Acomb_Green_Lane+Blossom_Street',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Acomb_Green_Lane',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Acomb_Green_Lane+Rail_Station',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Acomb_Green_Lane',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Acomb_Green_Lane+Piccadilly_(York)',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Acomb_Green_Lane',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Piccadilly_(York)',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Mattison_Way+Nursery_Drive',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Mattison_Way',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Nursery_Drive',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Mattison_Way+Holl_Bank/Beech_Ave',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Mattison_Way',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Holl_Bank/Beech_Ave',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Mattison_Way+Cambridge_Street',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Mattison_Way',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Cambridge_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Mattison_Way+Blossom_Street',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Mattison_Way',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Mattison_Way+Rail_Station',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Mattison_Way',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Mattison_Way+Piccadilly_(York)',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Mattison_Way',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Piccadilly_(York)',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Nursery_Drive+Holl_Bank/Beech_Ave',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Nursery_Drive',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Holl_Bank/Beech_Ave',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Nursery_Drive+Cambridge_Street_(York)',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Nursery_Drive',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Cambridge_Street_(York)',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Nursery_Drive+Blossom_Street',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Nursery_Drive',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Nursery_Drive+Rail_Station',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Nursery_Drive',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Nursery_Drive+Piccadilly_(York)',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Nursery_Drive',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Piccadilly_(York)',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Holl_Bank/Beech_Ave+Cambridge_Street',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Holl_Bank/Beech_Ave',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Cambridge_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Holl_Bank/Beech_Ave+Blossom_Street',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Holl_Bank/Beech_Ave',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Holl_Bank/Beech_Ave+Rail_Station',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Holl_Bank/Beech_Ave',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Holl_Bank/Beech_Ave+Piccadilly_(York)',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Holl_Bank/Beech_Ave',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Piccadilly_(York)',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Cambridge_Street_(York)+Blossom_Street',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Cambridge_Street_(York)',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Cambridge_Street_(York)+Rail_Station',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Cambridge_Street_(York)',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Cambridge_Street_(York)+Piccadilly_(York)',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Cambridge_Street_(York)',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Piccadilly_(York)',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Blossom_Street+Rail_Station',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Blossom_Street',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Blossom_Street+Piccadilly_(York)',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Blossom_Street',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Piccadilly_(York)',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id: 'Rail_Station+Piccadilly_(York)',
                                                                priceGroups: {
                                                                    PriceGroupRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00',
                                                                    },
                                                                },
                                                                StartTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Rail_Station',
                                                                },
                                                                EndTariffZoneRef: {
                                                                    version: '1.0',
                                                                    ref: 'fs@Piccadilly_(York)',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    GenericParameterAssignment: {
                                                        version: '1.0',
                                                        order: '01',
                                                        id: 'Tariff@single@lines',
                                                        TypeOfAccessRightAssignmentRef: {
                                                            version: 'fxc:v1.0',
                                                            ref: 'fxc:can_access',
                                                        },
                                                        ValidityParameterAssignmentType: 'EQ',
                                                        validityParameters: {
                                                            LineRef: {
                                                                version: '1.0',
                                                                ref: 'Line_354',
                                                            },
                                                        },
                                                    },
                                                },
                                                {
                                                    id: 'Tariff@single@eligibility',
                                                    version: '1.0',
                                                    Name: 'eligible user types',
                                                    GenericParameterAssignment: {
                                                        order: '1',
                                                        id: 'Tariff@single@eligibility',
                                                        version: '1.0',
                                                        TypeOfAccessRightAssignmentRef: {
                                                            version: 'fxc:v1.0',
                                                            ref: 'fxc:eligible',
                                                        },
                                                        LimitationGroupingType: 'XOR',
                                                        limitations: {
                                                            UserProfile: {
                                                                version: '1.0',
                                                                id: 'adult',
                                                                Name: 'Adult',
                                                                companionProfiles: {
                                                                    CompanionProfile: {
                                                                        version: '1.0',
                                                                        id: 'adult@infant',
                                                                        UserProfileRef: {
                                                                            ref: 'infant',
                                                                            version: '1.0',
                                                                        },
                                                                        MinimumNumberOfPersons: '0',
                                                                        MaximumNumberOfPersons: '3',
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                                {
                                                    id: 'Tariff@single@conditions_of_travel',
                                                    version: '1.0',
                                                    Name: 'eligible user types',
                                                    GenericParameterAssignment: {
                                                        version: '1.0',
                                                        order: '1',
                                                        id: 'Tariff@single@conditions_of_travel',
                                                        Name: 'Conditions of travel',
                                                        TypeOfAccessRightAssignmentRef: {
                                                            version: 'fxc:v1.0',
                                                            ref: 'fxc:condition_of_use',
                                                        },
                                                        LimitationGroupingType: 'AND',
                                                        limitations: {
                                                            RoundTrip: {
                                                                version: '1.0',
                                                                id: 'Trip@travel@condition@direction',
                                                                Name: 'Single Trip',
                                                                TripType: 'single',
                                                            },
                                                            FrequencyOfUse: {
                                                                version: '1.0',
                                                                id: 'Trip@single@oneTrip',
                                                                Name: 'One trip no transfers',
                                                                FrequencyOfUseType: 'none',
                                                                MaximalFrequency: '1',
                                                            },
                                                            Interchanging: {
                                                                version: '1.0',
                                                                id: 'Trip@single@NoTransfers',
                                                                MaximumNumberOfInterchanges: '0',
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        fareTables: {
                                            FareTableRef: {
                                                version: '1.0',
                                                ref: 'Trip@single-SOP@p-ticket@Line_354@adult',
                                            },
                                        },
                                    },
                                },
                                fareProducts: {
                                    PreassignedFareProduct: {
                                        version: '1.0',
                                        id: 'Trip@single',
                                        Name: 'Single Ticket',
                                        ChargingMomentRef: {
                                            version: 'fxc:v1.0',
                                            ref: 'fxc:prepayment',
                                        },
                                        TypeOfFareProductRef: {
                                            version: 'fxc:v1.0',
                                            ref: 'fxc:standard_product@trip@single',
                                        },
                                        validableElements: {
                                            ValidableElement: {
                                                version: '1.0',
                                                id: 'Trip@single@travel',
                                                Name: 'Single ride',
                                                fareStructureElements: {
                                                    FareStructureElementRef: [
                                                        {
                                                            version: '1.0',
                                                            ref: 'Tariff@single@lines',
                                                        },
                                                        {
                                                            version: '1.0',
                                                            ref: 'Tariff@single@eligibility',
                                                        },
                                                        {
                                                            version: '1.0',
                                                            ref: 'Tariff@single@conditions_of_travel',
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                        accessRightsInProduct: {
                                            AccessRightInProduct: {
                                                version: '1.0',
                                                id: 'Trip@single',
                                                order: '1',
                                                ValidableElementRef: {
                                                    version: '1.0',
                                                    ref: 'Trip@single@travel',
                                                },
                                            },
                                        },
                                    },
                                },
                                salesOfferPackages: {
                                    SalesOfferPackage: {
                                        version: '1.0',
                                        id: 'Trip@single-SOP@p-ticket',
                                        BrandingRef: {
                                            version: '1.0',
                                            ref: 'operator@brand',
                                        },
                                        Name: {},
                                        TypeOfSalesOfferPackageRef: {
                                            version: 'fxc:v1.0',
                                            ref: 'fxc:standard_product@operator',
                                        },
                                        distributionAssignments: {
                                            DistributionAssignment: [
                                                {
                                                    version: '10',
                                                    id: 'Trip@single-SOP@p-ticket@atStop',
                                                    order: '1',
                                                    Name: 'atStop',
                                                    Description: 'Pay for ticket atStop',
                                                    DistributionChannelRef: {
                                                        version: 'fxc:v1.0',
                                                        ref: 'fxc:on_board',
                                                    },
                                                    DistributionChannelType: 'atStop',
                                                    TicketingServiceFacilityList: 'purchase',
                                                    PaymentMethods: 'cashAndCard',
                                                    FulfilmentMethodRef: {
                                                        ref: 'fxc:collect_on_board',
                                                        version: 'fxc:v1.0',
                                                    },
                                                },
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@onBoard',
                                                    order: '2',
                                                    Name: 'Onboard',
                                                    Description: 'Pay for  ticket onboard',
                                                    DistributionChannelRef: {
                                                        version: 'fxc:v1.0',
                                                        ref: 'fxc:on_board',
                                                    },
                                                    DistributionChannelType: 'onBoard',
                                                    TicketingServiceFacilityList: 'purchase',
                                                    PaymentMethods: 'cashAndCard',
                                                    FulfilmentMethodRef: {
                                                        ref: 'fxc:collect_on_board',
                                                        version: 'fxc:v1.0',
                                                    },
                                                },
                                            ],
                                        },
                                        salesOfferPackageElements: {
                                            SalesOfferPackageElement: {
                                                version: '1.0',
                                                id: 'Trip@single-SOP@p-ticket',
                                                order: '1',
                                                TypeOfTravelDocumentRef: {
                                                    version: 'fxc:v1.0',
                                                    ref: 'fxc:printed_ticket',
                                                },
                                                PreassignedFareProductRef: {
                                                    version: '1.0',
                                                    ref: 'Trip@single',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                version: '1.0',
                                id: 'operator@Products@Trip@prices@Line_354',
                                dataSourceRef: 'op:operator',
                                responsibilitySetRef: 'tariffs',
                                TypeOfFrameRef: {
                                    ref: 'fxc:UK_Bus_tariff_profile@prices',
                                    version: 'fxc:v1.0',
                                },
                                FrameDefaults: {
                                    DefaultCurrency: 'GBP',
                                },
                                noticeAssignments: {},
                                priceGroups: {
                                    PriceGroup: [
                                        {
                                            version: '1.0',
                                            id: 'price_band_1.10',
                                            members: {
                                                GeographicalIntervalPrice: {
                                                    version: '1.0',
                                                    id: 'price_band_1.10@adult',
                                                    Amount: '1.10',
                                                },
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'price_band_1.70',
                                            members: {
                                                GeographicalIntervalPrice: {
                                                    version: '1.0',
                                                    id: 'price_band_1.70@adult',
                                                    Amount: '1.70',
                                                },
                                            },
                                        },
                                        {
                                            version: '1.0',
                                            id: 'price_band_1.00',
                                            members: {
                                                GeographicalIntervalPrice: {
                                                    version: '1.0',
                                                    id: 'price_band_1.00@adult',
                                                    Amount: '1.00',
                                                },
                                            },
                                        },
                                        {
                                            id: 'operator@Products@Trip@Line_354@adults',
                                            Name: 'A list of all the prices',
                                            DistanceMatrixElementPriceRef: [
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Mattison_Way',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Nursery_Drive',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Holl_Bank/Beech_Ave',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Cambridge_Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Blossom_Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Rail_Station',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Piccadilly_(York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Nursery_Drive',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Holl_Bank/Beech_Ave',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Cambridge_Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Blossom_Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Rail_Station',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Piccadilly_(York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Holl_Bank/Beech_Ave',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Cambridge_Street_(York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Blossom_Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Rail_Station',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Piccadilly_(York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave+Cambridge_Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave+Blossom_Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave+Rail_Station',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave+Piccadilly_(York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Cambridge_Street_(York)+Blossom_Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Cambridge_Street_(York)+Rail_Station',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Cambridge_Street_(York)+Piccadilly_(York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Blossom_Street+Rail_Station',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Blossom_Street+Piccadilly_(York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    ref:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Rail_Station+Piccadilly_(York)',
                                                },
                                            ],
                                        },
                                    ],
                                },
                                fareTables: {
                                    FareTable: {
                                        version: '1.0',
                                        id: 'Trip@single-SOP@p-ticket@Line_354@adult',
                                        Name: 'Test Description',
                                        Description: 'Adult Single Fares - Organised as a fare triangle',
                                        pricesFor: {
                                            PreassignedFareProductRef: {
                                                version: '1.0',
                                                ref: 'Trip@single',
                                            },
                                            SalesOfferPackageRef: {
                                                version: '1.0',
                                                ref: 'Trip@single-SOP@p-ticket',
                                            },
                                            UserProfileRef: {
                                                version: '1.0',
                                                ref: 'adult',
                                            },
                                        },
                                        usedIn: {
                                            TariffRef: {
                                                version: '1.0',
                                                ref: 'Tariff@single@Line_354',
                                            },
                                        },
                                        specifics: {
                                            LineRef: {
                                                version: '1.0',
                                                ref: 'Line_354',
                                            },
                                            TypeOfTravelDocumentRef: {
                                                version: 'fxc:v1.0',
                                                ref: 'fxc:printed_ticket',
                                            },
                                        },
                                        columns: {
                                            FareTableColumn: [
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@c1@Acomb_Green_Lane',
                                                    order: '1',
                                                    Name: 'Acomb Green Lane',
                                                },
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@c2@Mattison_Way',
                                                    order: '2',
                                                    Name: 'Mattison Way',
                                                },
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@c3@Nursery_Drive',
                                                    order: '3',
                                                    Name: 'Nursery Drive',
                                                },
                                                {
                                                    version: '1.0',
                                                    id:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c4@Holl_Bank/Beech_Ave',
                                                    order: '4',
                                                    Name: 'Holl Bank/Beech Ave',
                                                },
                                                {
                                                    version: '1.0',
                                                    id:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c5@Cambridge_Street_(York)',
                                                    order: '5',
                                                    Name: 'Cambridge Street (York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@c6@Blossom_Street',
                                                    order: '6',
                                                    Name: 'Blossom Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@c7@Rail_Station',
                                                    order: '7',
                                                    Name: 'Rail Station',
                                                },
                                            ],
                                        },
                                        rows: {
                                            FareTableRow: [
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@r1@Piccadilly_(York)',
                                                    order: '1',
                                                    Name: 'Piccadilly (York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@r2@Rail_Station',
                                                    order: '2',
                                                    Name: 'Rail Station',
                                                },
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@r3@Blossom_Street',
                                                    order: '3',
                                                    Name: 'Blossom Street',
                                                },
                                                {
                                                    version: '1.0',
                                                    id:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r4@Cambridge_Street_(York)',
                                                    order: '4',
                                                    Name: 'Cambridge Street (York)',
                                                },
                                                {
                                                    version: '1.0',
                                                    id:
                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r5@Holl_Bank/Beech_Ave',
                                                    order: '5',
                                                    Name: 'Holl Bank/Beech Ave',
                                                },
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@r6@Nursery_Drive',
                                                    order: '6',
                                                    Name: 'Nursery Drive',
                                                },
                                                {
                                                    version: '1.0',
                                                    id: 'Trip@single-SOP@p-ticket@Line_354@adult@r7@Mattison_Way',
                                                    order: '7',
                                                    Name: 'Mattison Way',
                                                },
                                            ],
                                        },
                                        includes: {
                                            FareTable: [
                                                {
                                                    Name: 'Acomb Green Lane',
                                                    Description: 'Column 1',
                                                    cells: {
                                                        Cell: [
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane',
                                                                order: '1',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Mattison_Way',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Acomb_Green_Lane+Mattison_Way',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c1@Acomb_Green_Lane',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r7@Mattison_Way',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane',
                                                                order: '2',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Nursery_Drive',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Acomb_Green_Lane+Nursery_Drive',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c1@Acomb_Green_Lane',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r6@Nursery_Drive',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane',
                                                                order: '3',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Holl_Bank/Beech_Ave',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Acomb_Green_Lane+Holl_Bank/Beech_Ave',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c1@Acomb_Green_Lane',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r5@Holl_Bank/Beech_Ave',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane',
                                                                order: '4',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Cambridge_Street',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Acomb_Green_Lane+Cambridge_Street',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c1@Acomb_Green_Lane',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r4@Cambridge_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane',
                                                                order: '5',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Blossom_Street',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Acomb_Green_Lane+Blossom_Street',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c1@Acomb_Green_Lane',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r3@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane',
                                                                order: '6',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Rail_Station',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Acomb_Green_Lane+Rail_Station',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c1@Acomb_Green_Lane',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r2@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane',
                                                                order: '7',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Acomb_Green_Lane+Piccadilly_(York)',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Acomb_Green_Lane+Piccadilly_(York)',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c1@Acomb_Green_Lane',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r1@Piccadilly_(York)',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    Name: 'Mattison Way',
                                                    Description: 'Column 2',
                                                    cells: {
                                                        Cell: [
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way',
                                                                order: '1',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Nursery_Drive',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Mattison_Way+Nursery_Drive',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c2@Mattison_Way',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r6@Nursery_Drive',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way',
                                                                order: '2',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Holl_Bank/Beech_Ave',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Mattison_Way+Holl_Bank/Beech_Ave',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c2@Mattison_Way',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r5@Holl_Bank/Beech_Ave',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way',
                                                                order: '3',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Cambridge_Street',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Mattison_Way+Cambridge_Street',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c2@Mattison_Way',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r4@Cambridge_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way',
                                                                order: '4',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Blossom_Street',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Mattison_Way+Blossom_Street',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c2@Mattison_Way',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r3@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way',
                                                                order: '5',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Rail_Station',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Mattison_Way+Rail_Station',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c2@Mattison_Way',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r2@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way',
                                                                order: '6',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Mattison_Way+Piccadilly_(York)',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Mattison_Way+Piccadilly_(York)',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c2@Mattison_Way',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r1@Piccadilly_(York)',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    Name: 'Nursery Drive',
                                                    Description: 'Column 3',
                                                    cells: {
                                                        Cell: [
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive',
                                                                order: '1',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Holl_Bank/Beech_Ave',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Nursery_Drive+Holl_Bank/Beech_Ave',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c3@Nursery_Drive',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r5@Holl_Bank/Beech_Ave',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive',
                                                                order: '2',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Cambridge_Street_(York)',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Nursery_Drive+Cambridge_Street_(York)',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c3@Nursery_Drive',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r4@Cambridge_Street_(York)',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive',
                                                                order: '3',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Blossom_Street',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Nursery_Drive+Blossom_Street',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c3@Nursery_Drive',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r3@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive',
                                                                order: '4',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Rail_Station',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Nursery_Drive+Rail_Station',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c3@Nursery_Drive',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r2@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive',
                                                                order: '5',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Nursery_Drive+Piccadilly_(York)',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Nursery_Drive+Piccadilly_(York)',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c3@Nursery_Drive',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r1@Piccadilly_(York)',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    Name: 'Holl Bank/Beech Ave',
                                                    Description: 'Column 4',
                                                    cells: {
                                                        Cell: [
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave',
                                                                order: '1',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave+Cambridge_Street',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Holl_Bank/Beech_Ave+Cambridge_Street',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c4@Holl_Bank/Beech_Ave',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r4@Cambridge_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave',
                                                                order: '2',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave+Blossom_Street',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.10@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Holl_Bank/Beech_Ave+Blossom_Street',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c4@Holl_Bank/Beech_Ave',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r3@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave',
                                                                order: '3',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave+Rail_Station',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Holl_Bank/Beech_Ave+Rail_Station',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c4@Holl_Bank/Beech_Ave',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r2@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave',
                                                                order: '4',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Holl_Bank/Beech_Ave+Piccadilly_(York)',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.70@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Holl_Bank/Beech_Ave+Piccadilly_(York)',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c4@Holl_Bank/Beech_Ave',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r1@Piccadilly_(York)',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    Name: 'Cambridge Street (York)',
                                                    Description: 'Column 5',
                                                    cells: {
                                                        Cell: [
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Cambridge_Street_(York)',
                                                                order: '1',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Cambridge_Street_(York)+Blossom_Street',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Cambridge_Street_(York)+Blossom_Street',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c5@Cambridge_Street_(York)',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r3@Blossom_Street',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Cambridge_Street_(York)',
                                                                order: '2',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Cambridge_Street_(York)+Rail_Station',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Cambridge_Street_(York)+Rail_Station',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c5@Cambridge_Street_(York)',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r2@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Cambridge_Street_(York)',
                                                                order: '3',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Cambridge_Street_(York)+Piccadilly_(York)',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref:
                                                                            'Cambridge_Street_(York)+Piccadilly_(York)',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c5@Cambridge_Street_(York)',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r1@Piccadilly_(York)',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    Name: 'Blossom Street',
                                                    Description: 'Column 6',
                                                    cells: {
                                                        Cell: [
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Blossom_Street',
                                                                order: '1',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Blossom_Street+Rail_Station',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Blossom_Street+Rail_Station',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c6@Blossom_Street',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r2@Rail_Station',
                                                                },
                                                            },
                                                            {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Blossom_Street',
                                                                order: '2',
                                                                DistanceMatrixElementPrice: {
                                                                    version: '1.0',
                                                                    id:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@Blossom_Street+Piccadilly_(York)',
                                                                    GeographicalIntervalPriceRef: {
                                                                        version: '1.0',
                                                                        ref: 'price_band_1.00@adult',
                                                                    },
                                                                    DistanceMatrixElementRef: {
                                                                        version: '1.0',
                                                                        ref: 'Blossom_Street+Piccadilly_(York)',
                                                                    },
                                                                },
                                                                ColumnRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@c6@Blossom_Street',
                                                                },
                                                                RowRef: {
                                                                    versionRef: '1',
                                                                    ref:
                                                                        'Trip@single-SOP@p-ticket@Line_354@adult@r1@Piccadilly_(York)',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    Name: 'Rail Station',
                                                    Description: 'Column 7',
                                                    cells: {
                                                        Cell: {
                                                            version: '1.0',
                                                            id: 'Trip@single-SOP@p-ticket@Line_354@adult@Rail_Station',
                                                            order: '1',
                                                            DistanceMatrixElementPrice: {
                                                                version: '1.0',
                                                                id:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@Rail_Station+Piccadilly_(York)',
                                                                GeographicalIntervalPriceRef: {
                                                                    version: '1.0',
                                                                    ref: 'price_band_1.00@adult',
                                                                },
                                                                DistanceMatrixElementRef: {
                                                                    version: '1.0',
                                                                    ref: 'Rail_Station+Piccadilly_(York)',
                                                                },
                                                            },
                                                            ColumnRef: {
                                                                versionRef: '1',
                                                                ref:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@c7@Rail_Station',
                                                            },
                                                            RowRef: {
                                                                versionRef: '1',
                                                                ref:
                                                                    'Trip@single-SOP@p-ticket@Line_354@adult@r1@Piccadilly_(York)',
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    id: 'fxc:DfT@Generic',
                    version: 'fxc:v1.0',
                    responsibilitySetRef: 'fxc:FXC_metadata',
                    dataSourceRef: 'fxc:common',
                    ValidBetween: {
                        FromDate: '2015-02-01T00:00:00',
                        ToDate: '2020-12-31T12:00:00',
                    },
                    Name: 'UK Bus Profile common resources',
                    TypeOfFrameRef: {
                        version: 'fxc:v1.0',
                        ref: 'fxc:UK_Bus_tariff_profile@UK_common_resources_composite',
                    },
                    FrameDefaults: {
                        DefaultCodespaceRef: {
                            ref: 'fxc',
                        },
                        DefaultDataSourceRef: {
                            ref: 'fxc:common',
                            version: 'fxc:v1.0',
                        },
                        DefaultResponsibilitySetRef: {
                            ref: 'fxc:FXC_metadata',
                            version: 'fxc:v1.0',
                        },
                    },
                    frames: {
                        FareFrame: {
                            id: 'fxc:Common_UK_Fare_Components',
                            version: 'fxc:v1.0',
                            responsibilitySetRef: 'fxc:FXC_metadata',
                            Name: 'Common Country independent fare component',
                            FrameDefaults: {
                                DefaultCodespaceRef: {
                                    ref: 'fxc',
                                },
                                DefaultDataSourceRef: {
                                    ref: 'fxc:common',
                                    version: 'fxc:v1.0',
                                },
                                DefaultResponsibilitySetRef: {
                                    ref: 'fxc:FXC_metadata',
                                    version: 'fxc:v1.0',
                                },
                            },
                            PricingParameterSet: {
                                id: 'fxc:Common_Resources',
                                version: 'fxc:v1.0',
                                priceUnits: {
                                    PriceUnit: [
                                        {
                                            id: 'fxc:GBP',
                                            version: 'fxc:v1.0',
                                            Name: 'Pound Sterling',
                                            PrivateCode: '£',
                                            Precision: '2',
                                        },
                                        {
                                            id: 'fxc:EUR',
                                            version: 'fxc:v1.0',
                                            Name: 'Euro',
                                            PrivateCode: '€',
                                            Precision: '2',
                                        },
                                    ],
                                },
                            },
                            geographicalUnits: {
                                GeographicalUnit: [
                                    {
                                        id: 'fxc:mi',
                                        version: 'fxc:v1.0',
                                        Name: 'Distance Unit Miles',
                                    },
                                    {
                                        id: 'fxc:km',
                                        version: 'fxc:v1.0',
                                        Name: 'Distance Unit Kilometres',
                                    },
                                    {
                                        id: 'fxc:unit_stage',
                                        version: 'fxc:v1.0',
                                        Name: 'Distance Unit Stage',
                                    },
                                ],
                            },
                            usageParameters: {
                                UserProfile: [
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:adult',
                                        Name: 'Adult',
                                        TypeOfConcessionRef: {
                                            version: 'fxc:v1.0',
                                            ref: 'fxc:none',
                                        },
                                        companionProfiles: {
                                            CompanionProfile: {
                                                version: 'fxc:v1.0',
                                                id: 'fxc:adult@infant',
                                                UserProfileRef: {
                                                    ref: 'fxc:infant',
                                                    version: 'fxc:v1.0',
                                                },
                                                MinimumNumberOfPersons: '0',
                                                MaximumNumberOfPersons: '3',
                                            },
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:child',
                                        Name: 'Child',
                                        TypeOfConcessionRef: {
                                            version: 'fxc:v1.0',
                                            ref: 'fxc:child',
                                        },
                                        MinimumAge: '5',
                                        MaximumAge: '15',
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:infant',
                                        Name: 'Infant',
                                        Description:
                                            'Up to three children under 5 years of age, accompanied by a fare paying adult or child passenger, and not occupying a seat, may travel free of charge on the Company’s services.',
                                        prices: {
                                            UsageParameterPrice: {
                                                version: 'fxc:v1.0',
                                                id: 'fxc:infant',
                                                Amount: '0',
                                            },
                                        },
                                        TypeOfConcessionRef: {
                                            version: 'fxc:v1.0',
                                            ref: 'fxc:infant',
                                        },
                                        MinimumAge: '0',
                                        MaximumAge: '4',
                                        companionProfiles: {
                                            CompanionProfile: {
                                                id: 'fxc:infant@adult',
                                                version: 'fxc:v1.0',
                                                UserProfileRef: {
                                                    ref: 'fxc:adult',
                                                    version: 'fxc:v1.0',
                                                },
                                                MinimumNumberOfPersons: '1',
                                                MaximumNumberOfPersons: '1',
                                                DiscountBasis: 'none',
                                            },
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:student',
                                        Name: 'Student',
                                        TypeOfConcessionRef: {
                                            version: 'fxc:v1.0',
                                            ref: 'fxc:student',
                                        },
                                        ProofRequired: 'membershipCard',
                                        DiscountBasis: 'discount',
                                    },
                                ],
                            },
                            distributionChannels: {
                                DistributionChannel: [
                                    {
                                        id: 'fxc:online',
                                        version: 'fxc:v1.0',
                                        ShortName: 'Internet sales',
                                        alternativeNames: {
                                            AlternativeName: [
                                                {
                                                    order: '1',
                                                    id: 'fxc:online_de',
                                                    version: 'fxc:v1.0',
                                                    Name: {
                                                        lang: 'de',
                                                        $t: 'Internetverkauf',
                                                    },
                                                },
                                                {
                                                    order: '1',
                                                    id: 'fxc:online_fr',
                                                    version: 'fxc:v1.0',
                                                    Name: {
                                                        lang: 'fr',
                                                        $t: "A vendre par l'internet",
                                                    },
                                                },
                                            ],
                                        },
                                        DistributionChannelType: 'online',
                                        IsObligatory: 'false',
                                    },
                                    {
                                        id: 'fxc:at_stop',
                                        version: 'fxc:v1.0',
                                        ShortName: 'In station sale by machine, counter or payg',
                                        DistributionChannelType: 'atStop',
                                        IsObligatory: 'false',
                                    },
                                    {
                                        id: 'fxc:self_service_ticket_machine',
                                        version: 'fxc:v1.0',
                                        ShortName: 'Automatic Ticket Machine',
                                        DistributionChannelType: 'atStop',
                                    },
                                    {
                                        id: 'fxc:pay_as_you_go_device',
                                        version: 'fxc:v1.0',
                                        ShortName: 'Automatic Ticket Machine',
                                        DistributionChannelType: 'atStop',
                                    },
                                    {
                                        id: 'fxc:at_counter',
                                        version: 'fxc:v1.0',
                                        ShortName: 'Ticket counter sale',
                                        alternativeNames: {
                                            AlternativeName: [
                                                {
                                                    order: '1',
                                                    id: 'fxc:at_counter_de',
                                                    version: 'fxc:v1.0',
                                                    Name: {
                                                        lang: 'de',
                                                        $t: 'Schalter',
                                                    },
                                                },
                                                {
                                                    order: '1',
                                                    id: 'fxc:at_counter_fr',
                                                    version: 'fxc:v1.0',
                                                    Name: {
                                                        lang: 'fr',
                                                        $t: 'A vendre par le guichet',
                                                    },
                                                },
                                            ],
                                        },
                                        DistributionChannelType: 'atStop',
                                        IsObligatory: 'false',
                                    },
                                    {
                                        id: 'fxc:on_board',
                                        version: 'fxc:v1.0',
                                        ShortName: 'on_board',
                                        DistributionChannelType: 'onBoard',
                                        IsObligatory: 'false',
                                    },
                                    {
                                        id: 'fxc:call_centre',
                                        version: 'fxc:v1.0',
                                        ShortName: 'Call Centre',
                                        DistributionChannelType: 'telephone',
                                        IsObligatory: 'false',
                                    },
                                    {
                                        id: 'fxc:operator_travel_shop',
                                        version: 'fxc:v1.0',
                                        ShortName: 'Operator Travel Shop',
                                        DistributionChannelType: 'telephone',
                                        IsObligatory: 'false',
                                    },
                                    {
                                        id: 'fxc:travel_agent',
                                        version: 'fxc:v1.0',
                                        ShortName: 'Travel Agent',
                                        DistributionChannelType: 'agency',
                                        IsObligatory: 'false',
                                    },
                                    {
                                        id: 'fxc:employee_organisation',
                                        version: 'fxc:v1.0',
                                        ShortName: 'Employee Organisation',
                                        DistributionChannelType: 'other',
                                        IsObligatory: 'false',
                                    },
                                    {
                                        id: 'fxc:statutory_organisation',
                                        version: 'fxc:v1.0',
                                        ShortName: 'Statutory Organisation',
                                        DistributionChannelType: 'other',
                                        IsObligatory: 'false',
                                    },
                                ],
                            },
                            fulfilmentMethods: {
                                FulfilmentMethod: [
                                    {
                                        id: 'fxc:collect_on_board',
                                        version: 'fxc:v1.0',
                                        Name: 'Collect on board',
                                        FulfilmentMethodType: 'conductor',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: [
                                                {
                                                    ref: 'fxc:printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:hand_written_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        id: 'fxc:collect_from_machine',
                                        version: 'fxc:v1.0',
                                        Name: 'Collect from machine',
                                        FulfilmentMethodType: 'ticketMachine',
                                        RequiresBookingReference: 'true',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: [
                                                {
                                                    ref: 'fxc:printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:magstripe_printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        id: 'fxc:collect_at_counter',
                                        version: 'fxc:v1.0',
                                        Name: 'Collect at counter',
                                        FulfilmentMethodType: 'ticketOffice',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: [
                                                {
                                                    ref: 'fxc:printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:magstripe_printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:pass',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:smart_card',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:hand_written_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:smart_card',
                                                    version: 'fxc:v1.0',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        id: 'fxc:collect_from_agent',
                                        version: 'fxc:v1.0',
                                        Name: 'Travel agent issues ticket directly',
                                        FulfilmentMethodType: 'agent',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: [
                                                {
                                                    ref: 'fxc:printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:electronic_document',
                                                    version: 'fxc:v1.0',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        id: 'fxc:mobile_app',
                                        version: 'fxc:v1.0',
                                        Name: 'Mobile App',
                                        FulfilmentMethodType: 'mobileApp',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: {
                                                ref: 'fxc:mobile_app_ticket',
                                                version: 'fxc:v1.0',
                                            },
                                        },
                                    },
                                    {
                                        id: 'fxc:self_print',
                                        version: 'fxc:v1.0',
                                        Name: 'Self Print',
                                        FulfilmentMethodType: 'selfprint',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: [
                                                {
                                                    ref: 'fxc:self_print_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:electronic_document',
                                                    version: 'fxc:v1.0',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        id: 'fxc:online_propagation',
                                        version: 'fxc:v1.0',
                                        Name: 'Online propagation',
                                        FulfilmentMethodType: 'validator',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: [
                                                {
                                                    ref: 'fxc:mobile_app_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:smart_card',
                                                    version: 'fxc:v1.0',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        id: 'fxc:email',
                                        version: 'fxc:v1.0',
                                        Name: 'EMAIL',
                                        FulfilmentMethodType: 'email',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: {
                                                ref: 'fxc:self_print_ticket',
                                                version: 'fxc:v1.0',
                                            },
                                        },
                                    },
                                    {
                                        id: 'fxc:post',
                                        version: 'fxc:v1.0',
                                        Name: 'Send ticket by post',
                                        FulfilmentMethodType: 'post',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: [
                                                {
                                                    ref: 'fxc:printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:magstripe_printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:pass',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:smart_card',
                                                    version: 'fxc:v1.0',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        id: 'fxc:courier',
                                        version: 'fxc:v1.0',
                                        Name: 'Send ticket by courier',
                                        FulfilmentMethodType: 'other',
                                        typesOfTravelDocument: {
                                            TypeOfTravelDocumentRef: [
                                                {
                                                    ref: 'fxc:printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:magstripe_printed_ticket',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:pass',
                                                    version: 'fxc:v1.0',
                                                },
                                                {
                                                    ref: 'fxc:smart_card',
                                                    version: 'fxc:v1.0',
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                            typesOfTravelDocuments: {
                                TypeOfTravelDocument: [
                                    {
                                        id: 'fxc:distribution_channel_dependent',
                                        version: 'fxc:v1.0',
                                        Name: 'Depends on channel used',
                                        MediaType: 'other',
                                    },
                                    {
                                        id: 'fxc:printed_ticket',
                                        version: 'fxc:v1.0',
                                        Name: 'Printed Ticket',
                                        MediaType: 'paperTicket',
                                        MachineReadable: 'ocr',
                                    },
                                    {
                                        id: 'fxc:hand_written_ticket',
                                        version: 'fxc:v1.0',
                                        Name: 'Hand written ticket',
                                        MediaType: 'paperTicket',
                                    },
                                    {
                                        id: 'fxc:magstripe_printed_ticket',
                                        version: 'fxc:v1.0',
                                        Name: 'Printed Ticket with magnetic Stripe',
                                        MediaType: 'paperTicket',
                                        MachineReadable: 'magneticStrip',
                                    },
                                    {
                                        id: 'fxc:self_print_ticket',
                                        version: 'fxc:v1.0',
                                        MediaType: 'selfPrintPaperTicket',
                                        MachineReadable: 'ocr',
                                    },
                                    {
                                        id: 'fxc:pass',
                                        version: 'fxc:v1.0',
                                        MediaType: 'card',
                                        MachineReadable: 'barCode',
                                    },
                                    {
                                        id: 'fxc:mobile_app_ticket',
                                        version: 'fxc:v1.0',
                                        MediaType: 'mobileApp',
                                        MachineReadable: 'ocr',
                                    },
                                    {
                                        id: 'fxc:smart_card',
                                        version: 'fxc:v1.0',
                                        MediaType: 'card',
                                        MachineReadable: 'chip',
                                    },
                                    {
                                        id: 'fxc:electronic_document',
                                        version: 'fxc:v1.0',
                                        MediaType: 'none',
                                        MachineReadable: 'ocr',
                                    },
                                    {
                                        id: 'fxc:membership_card',
                                        version: 'fxc:v1.0',
                                        MediaType: 'card',
                                        MachineReadable: 'none',
                                    },
                                ],
                            },
                        },
                        ResourceFrame: {
                            id: 'fxc:UK_Bus_Tariffs@Common_Resources',
                            version: 'fxc:v1.0',
                            responsibilitySetRef: 'fxc:FXC_metadata',
                            dataSourceRef: 'fxc:common',
                            Name: 'NaBT Common Country independent code values',
                            codespaces: {
                                Codespace: [
                                    {
                                        id: 'fxc',
                                        Xmlns: 'fxc',
                                        XmlnsUrl: 'http://farexchange.org.uk/fxc',
                                        Description: 'National Bus Tariff Profile metadata',
                                    },
                                    {
                                        id: 'napt',
                                        Xmlns: 'napt',
                                        XmlnsUrl: 'http://naptan.org.uk/napt',
                                        Description: 'NaPTAN metadata',
                                    },
                                    {
                                        id: 'naptStop',
                                        Xmlns: 'naptStop">',
                                        XmlnsUrl: 'http://naptan.org.uk/stops',
                                        Description: 'T stop data',
                                    },
                                    {
                                        id: 'nptg',
                                        Xmlns: 'nptg',
                                        XmlnsUrl: 'http://nptg.org.uk/',
                                        Description: 'National Public Transport gazetteer',
                                    },
                                    {
                                        id: 'nptgUkLocality',
                                        Xmlns: 'nptgUkLocality',
                                        XmlnsUrl: 'http://nptg.org.uk/locations',
                                        Description: 'National Public Transport gazetteer locations',
                                    },
                                    {
                                        id: 'nptgTariffZone',
                                        Xmlns: 'nptgTariffZone',
                                        XmlnsUrl: 'http://nptg.org.uk/tariffZones',
                                        Description: 'National Public Transport gazetteer plus bus zones',
                                    },
                                    {
                                        id: 'nptgUkAdministrativeArea',
                                        Xmlns: 'nptgUkAdministrativeArea',
                                        XmlnsUrl: 'http://www.nptg.org.uk/adminAreas',
                                        Description:
                                            'UK National Public Transport gazetteer. Codes of administrative areas, are unique within the UK.',
                                    },
                                    {
                                        id: 'noc',
                                        Xmlns: 'noc',
                                        XmlnsUrl: 'http://www.traveline.co.uk/noc',
                                        Description: 'UKnational operator codes',
                                    },
                                ],
                            },
                            FrameDefaults: {
                                DefaultCodespaceRef: {
                                    ref: 'fxc',
                                },
                                DefaultDataSourceRef: {
                                    ref: 'fxc:common',
                                    version: 'fxc:v1.0',
                                },
                                DefaultResponsibilitySetRef: {
                                    ref: 'fxc:FXC_metadata',
                                    version: 'fxc:v1.0',
                                },
                                DefaultLocale: {
                                    TimeZoneOffset: '0',
                                    TimeZone: 'GMT',
                                    SummerTimeZoneOffset: '+1',
                                    SummerTimeZone: 'BST',
                                    DefaultLanguage: 'en',
                                },
                                DefaultLocationSystem: 'WGS84',
                                DefaultSystemOfUnits: 'SiKilometersAndMetres',
                                DefaultCurrency: 'GBP',
                            },
                            versions: {
                                Version: {
                                    id: 'fxc:v1.0',
                                    version: 'any',
                                    Description: 'NPTG version 2.1',
                                    VersionType: 'baseline',
                                },
                            },
                            dataSources: {
                                DataSource: {
                                    id: 'fxc:common',
                                    version: 'fxc:v1.0',
                                    Email: 'standards@nptg.org.uk',
                                },
                            },
                            responsibilitySets: {
                                ResponsibilitySet: {
                                    version: 'fxc:v1.0',
                                    id: 'fxc:FXC_metadata',
                                    Name: 'Common',
                                    roles: {
                                        ResponsibilityRoleAssignment: {
                                            version: 'fxc:v1.0',
                                            id: 'fxc:FXC_metadata:DfT',
                                            DataRoleType: 'creates distributes',
                                            StakeholderRoleType: 'DataRegistrar',
                                            ResponsibleOrganisationRef: {
                                                ref: 'fxc:DfT',
                                                version: 'fxc:v1.0',
                                            },
                                            ResponsibleAreaRef: {
                                                ref: 'fxc:UK',
                                                $t: 'TODO',
                                            },
                                        },
                                    },
                                },
                            },
                            typesOfValue: {
                                ValueSet: [
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypeOfFrame',
                                        classOfValues: 'TypeOfFrame',
                                        Name: 'Types of UK Frame',
                                        values: {
                                            TypeOfFrame: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'nptg:UK_general_profile@locations',
                                                    Name: 'NPTG Locations Frame',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@fare_network',
                                                    Name: 'UK Bus Profile fare network',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@service_network',
                                                    Name: 'UK Bus Profile service network',
                                                    FrameClassRef: {
                                                        nameOfClass: 'ServiceFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@service_network@line',
                                                    Name: 'UK Bus Profile  service network',
                                                    FrameClassRef: {
                                                        nameOfClass: 'ServiceFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@site_network',
                                                    Name: 'UK Bus Profile site network',
                                                    FrameClassRef: {
                                                        nameOfClass: 'SiteFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@products',
                                                    Name: 'UK Bus Profile products',
                                                    FrameClassRef: {
                                                        nameOfClass: 'FareFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc::UK_Bus_tariff_profile@products@by_Line',
                                                    Name: 'UK Bus Profile tariff by line',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@prices',
                                                    Name: 'UK Bus Profile prices',
                                                    FrameClassRef: {
                                                        nameOfClass: 'FareFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@calendar',
                                                    Name: 'UK Bus Profile Operator calendar',
                                                    FrameClassRef: {
                                                        nameOfClass: 'ServiceCalendarFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@operator_resources',
                                                    Name: 'UK Bus Profile Operator resources',
                                                    FrameClassRef: {
                                                        nameOfClass: 'ResourceFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@operator_fare_resources',
                                                    Name: 'UK Bus Profile Operator resources',
                                                    FrameClassRef: {
                                                        nameOfClass: 'FareFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@transactions',
                                                    Name: 'UK Bus Profile Operator sample transactions',
                                                    FrameClassRef: {
                                                        nameOfClass: 'SalesTransactionFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@transactions_composite',
                                                    Name: 'UK Bus Profile Operator sample transactions - container',
                                                    FrameClassRef: {
                                                        nameOfClass: 'SalesTransactionFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@composite',
                                                    Name:
                                                        'UK Bus Profile coposite used to group other UK bus tariff frames',
                                                    FrameClassRef: {
                                                        nameOfClass: 'CompositeFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@UK_common_resources',
                                                    Name: 'UK Bus Profile common resources',
                                                    FrameClassRef: {
                                                        nameOfClass: 'ResourceFrame',
                                                    },
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:UK_Bus_tariff_profile@UK_common_resources_composite',
                                                    Name: 'UK Bus Profile common resources composite container',
                                                    FrameClassRef: {
                                                        nameOfClass: 'CompositeFrame',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:PointOfInterestClassification',
                                        classOfValues: 'PointOfInterestClassification',
                                        Name: 'Types of POI',
                                        values: {
                                            PointOfInterestClassification: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:operator_travel_shop',
                                                    Name: 'Travel Shop',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:tourist_information_centre',
                                                    Name: 'Tourist Information Centre',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypeOfFareZone',
                                        classOfValues: 'TypeOfZone',
                                        Name: 'Types of Fare Zone',
                                        values: {
                                            TypeOfZone: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:fare_zone@operator',
                                                    Name: 'Operator defined zone',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:fare_zone@multi_operator',
                                                    Name: 'MultiOperator defined zone',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:fare_zone@concessionary',
                                                    Name: 'Concessionary scheme zone',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfProductCategory',
                                        classOfValues: 'TypeOfProductCategory',
                                        Name: 'Types of Product Category',
                                        values: {
                                            TypeOfProductCategory: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:urban_bus',
                                                    Name: 'Urban Bus',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:rural_bus',
                                                    Name: 'Rural Bus',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:park_and_ride',
                                                    Name: 'Rural Bus',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:PurposesOfGrouping',
                                        classOfValues: 'PurposeOfGrouping',
                                        Name: 'Purposes of Grouping',
                                        values: {
                                            PurposeOfGrouping: {
                                                version: 'fxc:v1.0',
                                                id: 'fxc:route_exclusion',
                                                Name: 'Routes to be ommited',
                                            },
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:ChargingMoments',
                                        classOfValues: 'ChargingMoment',
                                        Name: 'Charging Moments',
                                        values: {
                                            ChargingMoment: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:prepayment',
                                                    Name: 'Prepaid',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:prepayment@pay_as_you_go',
                                                    Name: 'Prepaid - pay as you go',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:prepayment@bundled',
                                                    Name: 'Prepaid - paid along with a base product',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:prepayment@free',
                                                    Name: 'Prepaid - free issue',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc::post_payment',
                                                    Name: 'Prepaid',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfFareProduct@trip',
                                        classOfValues: 'TypeOfFareProduct',
                                        Name: 'Types Of Fare Product - Trip',
                                        values: {
                                            TypeOfFareProduct: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@trip@short_hop',
                                                    Name: 'Short hop fare',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@trip@single',
                                                    Name: 'Single fare',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:era:standard_product@trip@time_limited',
                                                    Name: 'Time Limited fare',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:special_product@Trip@period_return',
                                                    Name: 'Period return fare',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:era:special_produc@tript@day_return',
                                                    Name: 'Day retirn fare',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfFareProduct@pass',
                                        classOfValues: 'TypeOfFareProduct',
                                        Name: 'Types Of Fare Product - Pass',
                                        values: {
                                            TypeOfFareProduct: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@pass@day',
                                                    Name: 'day pass - till end of fare day',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@pass@24H',
                                                    Name: '24H from time of activation',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@pass@period',
                                                    Name: 'Pass for a specifed period',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfFareProduct@carnet',
                                        classOfValues: 'TypeOfFareProduct',
                                        Name: 'Types Of Fare Product - Pass',
                                        values: {
                                            TypeOfFareProduct: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@carnet@trips',
                                                    Name: 'Carnet of trips.',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@carnet@days',
                                                    Name: "Carnet of 1 day' passes.",
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfFareProduct@discount',
                                        classOfValues: 'TypeOfFareProduct',
                                        Name: 'Types Of Fare Product - Pass',
                                        values: {
                                            TypeOfFareProduct: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@discount@sales',
                                                    Name: 'Sales discount righty',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@discount@usage',
                                                    Name: 'Usage discount rights',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfFareProduct@stored_value',
                                        classOfValues: 'TypeOfFareProduct',
                                        Name: 'Types Of Fare Product  - Epurse',
                                        values: {
                                            TypeOfFareProduct: {
                                                version: 'fxc:v1.0',
                                                id: 'fxc:standard_product@stored_value@epurse',
                                                Name: 'Epurse',
                                            },
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfSalesOfferPackage',
                                        classOfValues: 'TypeOfSalesOfferPackage',
                                        Name: 'Types Of Sales Offer  Product',
                                        values: {
                                            TypeOfSalesOfferPackage: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@all_operators',
                                                    Name: 'Product is standrad and supported by all operators',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@multi_operator',
                                                    Name: 'Product is standrad and supported by all operators',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:standard_product@operator',
                                                    Name: 'Single operator standard product',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:special_product@operator',
                                                    Name: 'Single operator special product',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:ClassesOfUse',
                                        classOfValues: 'ClassOfUse',
                                        Name: 'Classes of Use',
                                        values: {
                                            ClassOfUse: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:first',
                                                    Name: 'First Class',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:second',
                                                    Name: 'Second Class',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfProjection',
                                        classOfValues: 'TypeOfProjection',
                                        Name: 'TypesOf Projection',
                                        values: {
                                            TypeOfProjection: {
                                                version: 'fxc:v1.0',
                                                id: 'fxc:tariff_zone_border',
                                                Name: 'The boundary stops for a fare_zone',
                                            },
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfFareContractEntry',
                                        classOfValues: 'TypeOfFareContractEntry',
                                        Name: 'Types of fare contract entry',
                                        values: {
                                            TypeOfFareContractEntry: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:product_purchase',
                                                    Name: 'Purchase',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:product_refund',
                                                    Name: 'Refund',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:online_purchase',
                                                    Name: 'Online Purchase',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:on_board_purchase',
                                                    Name: 'Cash Purchase',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfConcession',
                                        classOfValues: 'TypeOfConcession',
                                        Name: 'Types of concession',
                                        values: {
                                            TypeOfConcession: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:none',
                                                    Name: 'Adult',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:infant',
                                                    Name: 'Infant',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:child',
                                                    Name: 'Child',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:youth',
                                                    Name: 'Youth',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:school_pupil',
                                                    Name: 'School pupil',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:student',
                                                    Name: 'Student',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:young_adult',
                                                    Name: 'Youth',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:senior',
                                                    Name: 'Senior',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:registered_disabled',
                                                    Name: 'Registered disabled',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:animal',
                                                    Name: 'Animal',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:social',
                                                    Name: 'Social',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:statutory',
                                                    Name: 'Statutory',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfTariff',
                                        classOfValues: 'TypeOfTariff',
                                        Name: 'Types of Tariff',
                                        values: {
                                            TypeOfTariff: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:Distance_kilometers',
                                                    Name: 'Kilometer Distance Kilometers',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:flat',
                                                    Name: 'Flat',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:point_to_point',
                                                    Name: 'Point to point',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:zonal',
                                                    Name: 'Zonal',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:section',
                                                    Name: 'Section',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:banded',
                                                    Name: 'Section',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:stored_value',
                                                    Name: 'Stored value',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:multitrip',
                                                    Name: 'Multitrip carnet',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'fxc:TypesOfAccessRightAssignment',
                                        classOfValues: 'TypeOfAccessRightAssignment',
                                        Name: 'Types of Access right Assignment',
                                        values: {
                                            TypeOfAccessRightAssignment: [
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:eligible',
                                                    Name: 'Eligible for a product or discount',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:can_access',
                                                    Name: 'Grants access rights to use or travel on',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:cannot_access',
                                                    Name: 'Revokes access rights to use or travel on',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:must_access',
                                                    Name: 'Requires access rights to use or travel on',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:can_access_when',
                                                    Name: 'Grants access rights to use or travel during some period',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:can_access_if_purchased',
                                                    Name: 'Right defines a property that may be Accessed if purchased',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:can_use_with_type_of_travel_document',
                                                    Name: 'Right defines tyoe travel document condition',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:condition_of_use',
                                                    Name: 'Defines a condition or restriction on use',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:condition_of_sale',
                                                    Name: 'Defines a condition or restriction on purchase',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:can_purchase',
                                                    Name: 'Gives right to purchase',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:can_purchase_when',
                                                    Name: 'Specifies when a purchase can be made',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:can_purchase_where',
                                                    Name: 'Specifies where a purchase can be made',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:gives_entitlement',
                                                    Name: 'Gives right to other products',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:prerequisites',
                                                    Name: 'Requires right to other products',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:penalties',
                                                    Name: 'Penalties for misuuse',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:can_use_to_pay_for',
                                                    Name: 'Gives ability to purchase automatically using',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:payment_schedule',
                                                    Name: 'Specifices if subscription or single payment',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:reservation_condition',
                                                    Name: 'Indicates need for reservation',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:distribution_channel_restriction',
                                                    Name: 'Constrains availability for distribution by a channel',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:takes_properties_from_group',
                                                    Name: 'Takes properties from group package',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:quota_applies',
                                                    Name: 'Quota applies',
                                                },
                                                {
                                                    version: 'fxc:v1.0',
                                                    id: 'fxc:validity_chaining',
                                                    Name: 'Quota applies',
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                            organisations: {
                                GeneralOrganisation: {
                                    version: 'fxc:v1.0',
                                    id: 'fxc:DfT',
                                    Name: 'Department for Transport',
                                    ShortName: 'DfT',
                                    OrganisationType: 'statutoryBody',
                                },
                                Operator: [
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'uic:operator:1170',
                                        PublicCode: 'ATOC',
                                        Name: 'Association of Train Operating Companies Limited',
                                        ShortName: 'UIC',
                                        ValidityPeriod: {
                                            FromDate: '2001-01-01T00:00:00Z',
                                            ToDate: '2020-01-01T00:00:00Z',
                                        },
                                        CountryRef: {
                                            ref: 'uk',
                                            refPrincipality: 'GB-UKM',
                                        },
                                    },
                                    {
                                        version: 'fxc:v1.0',
                                        id: 'uic:Station_Management:0070',
                                        PublicCode: 'NR',
                                        Name: 'Network Rail Limited',
                                        ShortName: 'Network Rail',
                                        ValidityPeriod: {
                                            FromDate: '2003-09-22T00:00:00Z',
                                            ToDate: '2020-01-01T00:00:00Z',
                                        },
                                        CountryRef: {
                                            ref: 'uk',
                                            refPrincipality: 'GB-UKM',
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            ],
        },
    },
};
