import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
    console.log("name endpoint has been called");
    const objectToReturn = { name: "Fares data build tool" };
    res.status(200).json(objectToReturn);
}