import { hello } from './dataReading/bucketReader';
import { Handler} from 'aws-lambda';
import AWS from 'aws-sdk';

// this is the code that gets hit when the s3 event (object created) happens
export const s3hook: Handler = (event:any) => {
// here, we want to reference methods from other classes which will do the jobs we want

};