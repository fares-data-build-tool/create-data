# Scale or Cycle Fargate tasks

Certain Fargate services will autoscale their tasks based on CPU load in order to keep an average of 50% (eg. the Site tasks) however sometimes it may be necessary to scale up or cycle the tasks manually.

## Scaling Up / Down

- Navigate to the AWS console and assume a role into the desired environment (see [Access AWS](./access-aws.md) )
- Navigate to the ECS Console and select the cluster which contains the target service
- Select the target service (eg. `fdbt-site-prod`) and click update
- Click ‘Next’ twice to reach the auto-scaling settings, set the minimum, desired and maximum number of tasks as required
- Click ‘Next again and review your changes before clicking 'Update Service’ to scale up the site

Remember to scale the service back down following the same process if required

## Cycling

It may be necessary to cycle Fargate tasks if there is an issue, this can be done in a couple of ways:

### CLI

- Gain access to the target environment in the CLI (see [Access AWS](./access-aws.md))
- Run `aws ecs update-service --force-new-deployment --service {SERVICE_NAME} --cluster {CLUSTER_NAME}`
- This will force a rolling deployment with the same task definition that is currently being used, effectively restarting the service with no downtime

### Console - Destructive (Test and Pre-Prod only)

This method WILL cause downtime and so should be avoided in the production environment

- Navigate to the AWS console and assume a role into the desired environment (see [Access AWS](./access-aws.md))
- Navigate to the ECS Console and select the cluster which contains the target service
- Select the ‘Tasks’ tab
- Check all of the services you wish to cycle and click ‘Stop’
- This will immediately stop the tasks prompting Fargate to start some new tasks
