import { NextApiRequest, NextApiResponse } from 'next';
import { v1 } from 'uuid';

export default (_req: NextApiRequest, res: NextApiResponse): void => {
    const uuid = v1();
    const objectToReturn = { uuid };
    res.status(200).json(objectToReturn);
};
