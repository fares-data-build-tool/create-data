# Update contact details

In the event that the support email or phone number changes or we want to update the from address, changes need to be made in a couple of places.

1. Add any new email addresses that we wish to send from into SES in the Ireland region
   1. Login to AWS and assume role into target account (see [Access AWS](./access-aws.md))
   2. Navigate to SES and change region to Ireland
   3. Click ‘Email Addresses’ on the left and then click ‘Verify a New Email Address’
   4. Type in the address and confirm
   5. The email will then need to be verified by the owner of the address before continuing
   6. After being validated take note of the ARN of the email address
2. Site environment variables (see [Update environment variables](./update-environment-variables.md))
   1. `SUPPORT_EMAIL_ADDRESS` - Email address to contact the service desk
   2. `SUPPORT_PHONE_NUMBER` - Phone number to contact service desk
   3. `SERVICE_EMAIL_ADDRESS` - Email from address for feedback
3. NeTEx emailer environment variables
   1. `SERVICE_EMAIL_ADDRESS` - Email from address for NeTEx (this change needs to be made in the code or it will be overridden in subsequent releases)
4. Update the static error page which is saved in the site repo
   1. After updating the value, the html file will need uploading to the static error S3 bucket in all environments
