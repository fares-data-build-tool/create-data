import {
    TICKET_REPRESENTATION_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
} from '../../../src/constants/attributes';
import { SessionAttributeTypes } from '../../../src/utils/sessions';
import {
    expectedPeriodGeoZoneTicketWithMultipleProducts,
    expectedSingleTicket,
    getMockRequestAndResponse,
    mockDataSplitOutProducts,
} from '../../testData/mockData';
import salesConfirmation from '../../../src/pages/api/salesConfirmation';
import * as userData from '../../../src/utils/apiUtils/userData';
import * as index from '../../../src/utils/apiUtils/index';

describe('salesConfirmation', () => {
    const getSchemeOperatorTicketJsonSpy = jest.spyOn(userData, 'getSchemeOperatorTicketJson');
    const getSingleTicketJsonSpy = jest.spyOn(userData, 'getSingleTicketJson');
    const getReturnTicketJsonSpy = jest.spyOn(userData, 'getReturnTicketJson');
    const getGeoZoneTicketJsonSpy = jest.spyOn(userData, 'getGeoZoneTicketJson');
    const getMultipleServicesTicketJsonSpy = jest.spyOn(userData, 'getMultipleServicesTicketJson');

    beforeEach(() => {
        process.env.STAGE = 'dev';
        jest.resetAllMocks();
    });

    it('gets scheme operator json for a scheme operator', async () => {
        const isSchemeOperatorSpy = jest.spyOn(index, 'isSchemeOperator');
        isSchemeOperatorSpy.mockImplementation(() => true);
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        await salesConfirmation(req, res);

        expect(getSchemeOperatorTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets single json for a single ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' },
            },
        });

        await salesConfirmation(req, res);

        expect(getSingleTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets return json for a return ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' },
            },
        });

        await salesConfirmation(req, res);

        expect(getReturnTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets geoZone json for a period geoZone ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getGeoZoneTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets geoZone json for a multi operator geoZone ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getGeoZoneTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets multiService json for a period multiService ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getMultipleServicesTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets multiService json for a multi operator multiService ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getMultipleServicesTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets flatFare json for a flatFare multiple services ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getMultipleServicesTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets flatFare json for a flatFare geoZone ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getGeoZoneTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('creates a group definition for a group ticket with one product and adds to user json object', async () => {
        const putUserDataInS3Spy = jest.spyOn(userData, 'putUserDataInProductsBucket');
        putUserDataInS3Spy.mockImplementation(() => Promise.resolve('pathToFile'));
        const insertDataToProductsBucketAndProductsTableSpy = jest.spyOn(
            userData,
            'insertDataToProductsBucketAndProductsTable',
        );
        insertDataToProductsBucketAndProductsTableSpy.mockImplementationOnce(() => Promise.resolve('pathOne'));
        getSingleTicketJsonSpy.mockImplementation(() => {
            return expectedSingleTicket;
        });
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [GROUP_PASSENGER_INFO_ATTRIBUTE]: {
                    thing: 'test thing',
                },
                [GROUP_SIZE_ATTRIBUTE]: {
                    thing: 'another test thing',
                },
                [PASSENGER_TYPE_ATTRIBUTE]: {
                    passengerType: 'group',
                },
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' },
            } as unknown as SessionAttributeTypes,
        });

        await salesConfirmation(req, res);

        expect(insertDataToProductsBucketAndProductsTableSpy).toBeCalledWith(
            expectedSingleTicket,
            'TEST',
            '1e0459b3-082e-4e70-89db-96e8ae173e10',
            'geoZone',
            undefined,
            expect.any(Object),
        );
    });

    it('creates multiple matching jsons for a matching json with multiple products, and adds them individually to the products table and bucket', async () => {
        const putUserDataInS3Spy = jest.spyOn(userData, 'putUserDataInProductsBucket');
        const splitUserDataJsonByProductsSpy = jest.spyOn(userData, 'splitUserDataJsonByProducts');
        putUserDataInS3Spy.mockImplementation(() => Promise.resolve('pathToFile'));
        const insertDataToProductsBucketAndProductsTableSpy = jest.spyOn(
            userData,
            'insertDataToProductsBucketAndProductsTable',
        );
        getGeoZoneTicketJsonSpy.mockResolvedValue(expectedPeriodGeoZoneTicketWithMultipleProducts);
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(splitUserDataJsonByProductsSpy.mock.results[0].value[0]).toEqual(mockDataSplitOutProducts[0]);
        expect(splitUserDataJsonByProductsSpy.mock.results[0].value[1]).toEqual(mockDataSplitOutProducts[1]);
        expect(splitUserDataJsonByProductsSpy.mock.results[0].value[2]).toEqual(mockDataSplitOutProducts[2]);

        expect(insertDataToProductsBucketAndProductsTableSpy).toBeCalledTimes(3);
    });
});
