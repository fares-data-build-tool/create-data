# Access data in S3

Various forms of user data are stored in S3 and will often need to be retrieved for analysis or debugging purposes. This can be achieved either through the console or using the CLI.

## Console

- Access the target account using the AWS Extend Switch Roles extension (see [Access AWS](../how-to/access-aws.md) for details)
- Navigate to the S3 console and select your desired bucket
- Search for your desired file and select download

## CLI

- Access the target account (see [Access AWS](../how-to/access-aws.md) for details)
- Run `aws s3 cp s3://{BUCKET_NAME}/{FILE_PATH} .` to download a single file to your current directory
- Run \``aws s3 --recursive s3://{BUCKET_NAME}/{FOLDER_PATH} .` to download folders recursively to your current directory
