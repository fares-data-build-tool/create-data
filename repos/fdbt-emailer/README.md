# fdbt-emailer

This directory stores the function code for emailer functions that send notification to users for the CFDS service.

# multi-operator-action-required-emailer

This lambda function sends email reminders to operators collaborating on multi-operator products.

When a new multi-operator product is created, any secondary operators included as part of the product's
attached operator group will need to add their details to the product before the product is considered
complete. On a daily basis, the lambda will check for any incomplete multi-operator product that have
been modified in the last 24 hours and fetches a list of users who are opted in to multi-operator
email notifications, then send emails to those users prompting them to complete their details.


# multi-operator-product-complete-emailer

This lambda function sends email reminders to lead operators when all secondary operators have completed 
their information needed for a multi-operator fare.

On a daily basis, the lambda will check for any completed multi-operator product that have
been modified in the last 24 hours and fetches a list of users who are opted in to multi-operator
email notifications, then send emails to those users prompting them to complete their details.