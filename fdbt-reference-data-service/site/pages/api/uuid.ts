import { NextApiRequest, NextApiResponse } from 'next'
import { v1 } from 'uuid'

export default (req: NextApiRequest, res: NextApiResponse) => {
    console.log("uuid endpoint has been called");
    const uuid = v1();
    const objectToReturn = { uuid };
    res.status(200).json(objectToReturn);
}