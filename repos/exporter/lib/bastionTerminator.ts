import { Handler } from 'aws-lambda';
import 'source-map-support/register';
import { EC2 } from 'aws-sdk';

const ec2 = new EC2();

export const handler: Handler = async () => {
    console.log(`triggered the terminator lambda...`);

    const instances = await ec2
        .describeInstances({
            Filters: [
                { Name: 'tag:Bastion', Values: ['true'] },
                { Name: 'instance-state-name', Values: ['running'] },
            ],
        })
        .promise();

    const instance = instances.Reservations?.[0].Instances?.[0].InstanceId;

    if (!instance) {
        throw new Error("couldn't find the bastion");
    }

    console.log(`terminating ${instance}`);

    await ec2.terminateInstances({ InstanceIds: [instance] }).promise();

    console.log(`terminated ${instance}`);
};
