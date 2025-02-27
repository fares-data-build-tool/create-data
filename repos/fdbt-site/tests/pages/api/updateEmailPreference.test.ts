import * as cognito from '../../../src/data/cognito';
import { getMockRequestAndResponse } from '../../testData/mockData';
import updateUserAttribute from '../../../src/pages/api/updateEmailPreference';
import { NextApiResponse } from 'next';
import * as apiUtils from '../../../src/utils/apiUtils';

describe('updateUserAttribute', () => {
    const updateUserAttributesSpy = jest.spyOn(cognito, 'updateUserAttributes');
    const redirectToSpy = jest.spyOn(apiUtils, 'redirectTo');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should not call cognito if running locally', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        await updateUserAttribute(req, res);
        expect(updateUserAttributesSpy).not.toHaveBeenCalled();
        expect(redirectToSpy).toBeCalledWith(res, '/home');
    });

    it.each([{ attributeName: 'test' }, { attributeValue: 'test' }])(
        'should not call cognito if attributeName or attributeValue is not provided in the body',
        async (body) => {
            const { req, res } = getMockRequestAndResponse({
                body: body,
                requestHeaders: { host: 'https://example.com' },
            });

            await updateUserAttribute(req, {
                ...res,
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as NextApiResponse);
            expect(updateUserAttributesSpy).not.toHaveBeenCalled();
        },
    );

    it('should call cognito if required properties are provided', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                attributeName: 'custom:testAttribute',
                attributeValue: 'testValue',
            },
            requestHeaders: { host: 'https://example.com' },
        });
        updateUserAttributesSpy.mockResolvedValue(new Promise((resolve) => resolve()));

        await updateUserAttribute(req, {
            ...res,
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as NextApiResponse);
        expect(updateUserAttributesSpy).toHaveBeenCalled();
        expect(updateUserAttributesSpy).toBeCalledWith('test@example.com', [
            { Name: 'custom:testAttribute', Value: 'testValue' },
        ]);
    });
});
