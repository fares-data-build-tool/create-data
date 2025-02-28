# Create fares data service multi-operator emailer

This lambda function sends email reminders to operators collaborating on multi-operator products.

When a new multi-operator product is created, any secondary operators included as part of the product's
attached operator group will need to add their details to the product before the product is considered
complete. On a daily basis, the lambda will check for any incomplete multi-operator product that has
been modified in the last 24 hours, and also fetch a list of users who are opted in to multi-operator
email notifications, then send emails to those users whose product details are incomplete.

The email acts as a reminder to the user to log in and complete details on any outstanding products.
