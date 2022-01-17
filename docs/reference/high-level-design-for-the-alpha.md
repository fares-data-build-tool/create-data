# High Level Design for the Alpha

**Please note this is the HLD for the Alpha phase, it would be built upon for the BETA phase in the future. Please see the [High Level Design Documentation](./high-level-design.md) for the latest design information**

# Notes on the High Level Diagram

- **No Javascript**: We have to provide a website that will work without Javascript, and this means that we have to use server side rendering (utilizing NextJs9). This limits how we deliver this solution.

- **State in Cookies** (I.e. which values the user have selected)

would be stored inside Cookies for the alpha phase.

For the beta phase state can be either stored on the server side inside a persistent store such as dynamoDB, or elastic cache etc (there are a few options for this which can be visited later).

# Justification of the High Level Diagram

## AWS

- AWS was chosen because of the team skills and fit within the IWC staff.

The staff allocated to this project are much more familiar with AWS than any other cloud provider.

AWS also provides the managed services which we can use for a very cost effective price.

they have been listed below

## Lambda

AWS Lambda is an event-driven, serverless computing platform provided by AWS.

### Scalability

####

Q: How available are AWS Lambda functions?

AWS Lambda is designed to use replication and redundancy to provide high availability for both the service itself and for the Lambda functions it operates. There are no maintenance windows or scheduled downtimes for either.

[https://aws.amazon.com/lambda/faqs/](https://aws.amazon.com/lambda/faqs/)

#### Q: Is there a limit to the number of AWS Lambda functions I can execute at once?

No. AWS Lambda is designed to run many instances of your functions in parallel. However, AWS Lambda has a default safety throttle for number of concurrent executions per account per region. You can also control the maximum concurrent executions for individual AWS Lambda functions which you can use to reserve a subset of your account concurrency limit for critical functions, or cap traffic rates to downstream resources.

[https://aws.amazon.com/lambda/faqs/](https://aws.amazon.com/lambda/faqs/)

#### Q: What are the Concurrent limits for lambda?

The first time you invoke your function, AWS Lambda creates an instance of the function and runs its handler method to process the event. When the function returns a response, it sticks around to process additional events. If you invoke the function again while the first event is being processed, Lambda creates another instance.

As more events come in, Lambda routes them to available instances and creates new instances as needed. Your function's _concurrency_ is the number of instances serving requests at a given time. For an initial burst of traffic, your function's concurrency can reach an initial level of between 500 and 3000, which varies per Region.

**Initial Concurrency Burst Limits**

- **3000** – US West (Oregon), US East (N. Virginia), Europe (Ireland).

[https://docs.aws.amazon.com/lambda/latest/dg/scaling.html#concurrent-execution-safety-limit](https://docs.aws.amazon.com/lambda/latest/dg/scaling.html#concurrent-execution-safety-limit)

### Performance

The architecture has been segregated into decoupled components logically grouped into lambdas.

This means each lambda should focus on a single responsibility thus reducing the execution time and allowing isolation in case of any faults.

This should result in short, quick and fast executions.

### Pricing

The tool will not need a hosted managed server as it would be too expensive for the amount of times the tool would be used annually. Also since the lambda execution is cheap to run, it makes sense to use AWS lambda. All AWS prices for lambda for the London region.

|          | Price                            |
| -------- | -------------------------------- |
| Requests | $0.20 per 1M requests            |
| Duration | $0.000016667 for every GB-second |

The price for **Duration** depends on the amount of memory you allocate to your function. You can allocate any amount of memory to your function between 128MB and 3008MB, in 64MB increments. The table below contains a few examples of the price per 100ms associated with different memory sizes.

| Memory (MB) | Price per 100ms |
| ----------- | --------------- |
| 128         | $0.000000208    |
| 512         | $0.000000833    |
| 1024        | $0.000001667    |
| 1536        | $0.000002500    |
| 2048        | $0.000003333    |
| 3008        | $0.000004896    |

[https://aws.amazon.com/lambda/pricing/](https://aws.amazon.com/lambda/pricing/)

## DynamoDB

Amazon DynamoDB is a fully managed proprietary NoSQL database service that supports key-value and document data structures.

### Scalability

For the alpha solution due to the estimated traffic patterns not being very high annually, we have chosen to go with DynamoDB and on-demand capacity. DynamoDB will handle the auto provisioning of extra capacity when needed.

With on-demand capacity mode, You do not need to specify how much read and write throughput you expect your application to perform as DynamoDB instantly accommodates your workloads as they ramp up or down.

[https://aws.amazon.com/dynamodb/pricing/on-demand/](https://aws.amazon.com/dynamodb/pricing/on-demand/)

### Performance

Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.

[https://aws.amazon.com/dynamodb/](https://aws.amazon.com/dynamodb/)

### Pricing

With on-demand provisioning AWS will help ramp up our performance when we need it automatically during the high traffic times and keep it low when usage is low, thus keeping costs down.

Also the usage of Dynamodb is cheap, and AWS manage it completely for you. So you do not have to think about servers and the cost and maintenance of hosted database servers.

- EU (London) Write request units: $1.4846 per million write request units
- EU (London) Read request units: $0.297 per million read request units

[https://aws.amazon.com/dynamodb/pricing/on-demand/](https://aws.amazon.com/dynamodb/pricing/on-demand/)

## S3

Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services that provides object storage through a web service interface.

### Scalability

S3 scales your storage resources up and down to meet fluctuating demands, without upfront investments or resource procurement cycles. Amazon S3 is designed for 99.999999999% (11 9’s) of data durability because it automatically creates and stores copies of all S3 objects across multiple systems. This means your data is available when needed and protected against failures, errors, and threats.

[https://aws.amazon.com/s3/](https://aws.amazon.com/s3/)

### Performance

Amazon S3 provides increased performance to support at least 3,500 requests per second to add data and 5,500 requests per second to retrieve data

[https://aws.amazon.com/about-aws/whats-new/2018/07/amazon-s3-announces-increased-request-rate-performance/](https://aws.amazon.com/about-aws/whats-new/2018/07/amazon-s3-announces-increased-request-rate-performance/)

### Pricing

AWS S3 is very cheap and cost effective. Below are their prices.

This means we can use AWS S3 to store reference data and user data.

- EU (London) S3 Standard
- General purpose storage for any type of data, typically used for frequently accessed data
- First 50 TB / Month is $0.024 per GB

[https://aws.amazon.com/s3/pricing/](https://aws.amazon.com/s3/pricing/)
