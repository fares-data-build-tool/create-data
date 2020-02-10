/* eslint-disable @typescript-eslint/no-explicit-any */

import { mockRequest } from 'mock-req-res';
import uuidHandler from '../../../src/pages/api/uuid';

describe('uuid handler', () => {
    it('should return a uuid', () => {
        const req = mockRequest();
        const val = {
            json: jest.fn(),
        };
        const res: any = {
            status: jest.fn().mockReturnValue(val),
        };
        uuidHandler(req, res);
        expect(res.status).toHaveBeenCalled();
        expect(val.json).toHaveBeenCalled();
    });
});
