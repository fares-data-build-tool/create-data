import * as cognito from '../../../src/data/cognito';
import { getMockRequestAndResponse } from '../../testData/mockData';
import updateUserAttribute from '../../../src/pages/api/updateUserAttribute';
import { NextApiResponse } from 'next';

describe('updateUserAttribute', () => {
    const updateUserAttributesSpy = jest.spyOn(cognito, 'updateUserAttributes');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should not call cognito if running locally', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        await updateUserAttribute(req, {
            ...res,
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as NextApiResponse);
        expect(updateUserAttributesSpy).not.toHaveBeenCalled();
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
