import { NextApiRequest } from "next";

export function operatorBusinessLogic(value: string){
    console.log("your value is "+value);
    // todo go to dynamodb  or s3 or do some maths
}

export function serviceBusinessLogic(value: string){
    console.log("your value is "+value);
    // todo go to dynamodb  or s3 or do some maths
}

export function stagesBusinessLogic(req: NextApiRequest){
    console.log(req.body);
    // todo go to dynamodb  or s3 or do some maths
}