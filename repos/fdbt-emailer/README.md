# Create fares data service multi-operator emailer

This lambda function sends email reminders to operators collaborating on multi-operator products.

When a new multi-operator product is created, any secondary operators included as part of the product's
attached operator group will need to add their details to the product before the product is considered
complete. On a daily basis, the lambda will check for any incomplete multi-operator product that have
been modified in the last 24 hours and fetches a list of users who are opted in to multi-operator
email notifications, then send emails to those users prompting them to complete their details.
