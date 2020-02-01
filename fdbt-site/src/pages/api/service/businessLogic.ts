import { NextApiRequest } from 'next';

export const operatorBusinessLogic = (value: string) => {
    if (value) {
        console.log(`your value is ${value}`);
        // todo go to dynamodb  or s3 or do some maths
    } else {
        throw new Error('operator not found in request body');
    }
};

export const serviceBusinessLogic = (value: string) => {
    if (value) {
        console.log(`your value is ${value}`);
        // todo go to dynamodb  or s3 or do some maths
    } else {
        throw new Error('operator not found in request body');
    }
};

export const stagesBusinessLogic = (req: NextApiRequest) => {
    if (req && req.body) {
        console.log(`your value is ${req.body}`);
        // todo go to dynamodb  or s3 or do some maths
    } else {
        throw new Error('operator not found in request body');
    }
};
