import { CAPS_DEFINITION_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../../../src/constants/attributes';
import * as auroradb from '../../../src/data/auroradb';
import defineCaps from '../../../src/pages/api/defineCaps';
import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse, mockIdTokenMultiple } from '../../testData/mockData';
import * as userData from '../../../src/utils/apiUtils/userData';
import { ExpiryUnit } from '../../../src/interfaces/matchingJsonTypes';

describe('defineCaps', () => {
    const writeHeadMock = jest.fn();
    const s3Spy = jest.spyOn(userData, 'putUserDataInProductsBucketWithFilePath');
    s3Spy.mockImplementation(() => Promise.resolve('pathToFile'));

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should set the CAPS_DEFINITION_ATTRIBUTE and redirect to select purchase methods when no errors are found', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const getCapByNocAndIdSpy = jest.spyOn(auroradb, 'getCapByNocAndId');
        getCapByNocAndIdSpy.mockImplementation().mockResolvedValue({
            id: 2,
            cap: {
                name: 'cappy cap',
                price: '2',
                durationAmount: '24hr',
                durationUnits: ExpiryUnit.HOUR,
            },
        });
        const { req, res } = getMockRequestAndResponse({
            body: {
                capChoice: 'yes',
                cap: 2,
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            cookieValues: {
                idToken: mockIdTokenMultiple,
            },
            session: {
                [OPERATOR_ATTRIBUTE]: { name: 'test', nocCode: 'HELLO', uuid: 'blah' },
            },
        });
        await defineCaps(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, CAPS_DEFINITION_ATTRIBUTE, {
            fullCaps: [
                {
                    id: 2,
                    cap: {
                        name: 'cappy cap',
                        price: '2',
                        durationAmount: '24hr',
                        durationUnits: ExpiryUnit.HOUR,
                    },
                },
            ],
            errors: [],
            id: 2,
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });

        expect(getCapByNocAndIdSpy).toBeCalledWith('HELLO', 2);
    });

    it('redirect back to defineCaps with errors if user does not select a premade cap but chose yes radio button', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const { req, res } = getMockRequestAndResponse({
            body: {
                capChoice: 'yes',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await defineCaps(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, CAPS_DEFINITION_ATTRIBUTE, {
            id: undefined,
            capChoice: 'yes',
            fullCaps: [],
            errors: [{ errorMessage: 'Choose one of the premade caps', id: 'caps' }],
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectCaps',
        });
    });
    it('redirect back to defineCaps with errors if user does not select any radio button', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const { req, res } = getMockRequestAndResponse({
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await defineCaps(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, CAPS_DEFINITION_ATTRIBUTE, {
            id: undefined,
            capChoice: undefined,
            fullCaps: [],
            errors: [{ errorMessage: 'Choose one of the options below', id: 'no-caps' }],
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectCaps',
        });
    });
});
