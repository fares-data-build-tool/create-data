import { Handler } from 'aws-lambda';
import 'source-map-support/register';
import { DescribeInstancesCommand, EC2Client, TerminateInstancesCommand } from '@aws-sdk/client-ec2';

const ec2 = new EC2Client();

export const handler: Handler = async () => {
    console.log(`triggered the terminator lambda...`);

    const command = new DescribeInstancesCommand({
        Filters: [
            { Name: 'tag:Bastion', Values: ['true'] },
            { Name: 'instance-state-name', Values: ['running'] },
        ],
    });
    const instances = await ec2.send(command);

    const instance = instances.Reservations?.[0].Instances?.[0].InstanceId;

    if (!instance) {
        throw new Error("couldn't find the bastion");
    }

    console.log(`terminating ${instance}`);

    const commandTerminate = new TerminateInstancesCommand({ InstanceIds: [instance] });

    await ec2.send(commandTerminate);

    console.log(`terminated ${instance}`);
};
