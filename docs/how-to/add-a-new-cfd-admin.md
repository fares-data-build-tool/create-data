# Add a New CFD Admin

Create Fares Data (CFD) Admins use the [Admin Site](https://admin.prod.dft-cfd.com/) to be able to manage the CFD application.

If the Admin is part of 1st line support, they can do actions like:

- Creating a new CFD User

If the Admin is part of the 2nd and 3rd line support, see [Granting Full Admin](#granting-full-admin-fulladmin), they can also:

- Edit the NOCs of a CFD User
- Delete a CFD User
- Clear a "Stuck Export" for a CFD NOC

## Adding a new user

To be able to add a new CFD Admin, you must have Prod AWS account access with the ability to make changes in Cognito

- Access the Prod account (see [Access AWS](../how-to/access-aws.md) for details)
- Go to Cognito in `eu-west-2` (London)
- Go to "User pools" > "fdbt-admin-user-pool-prod"
- In the "Users" box, click "Create user"
- Under "User information":
  - "Invitation Message": Send an email invitation
  - "Email address": "\<enter the new users email address\>"
  - "Mark email address as verified": Checked
  - "Temporary password": Generate a password
- The new Admin should then receive and email with the subject "Register for Create Fares Data Admin Panel"
  - This confirms their username and contains a temporary password
- They can now login and do 1st/2nd line actions, if they are a 2nd/3rd line Admin see [Granting Full Admin](#granting-full-admin-fulladmin)

### Granting Full Admin (`fullAdmin`)

- Access the Prod account (see [Access AWS](../how-to/access-aws.md) for details)
- Go to Cognito in `eu-west-2` (London)
- Go to "User pools" > "fdbt-admin-user-pool-prod"
- Find the desired user in the "Users" list and click their username
  - Use the search on "Email address" if needed
- In the "User attributes" box, click "Edit"
- Under "Optional attributes", click "Add attribute" at the bottom
- From the dropdown "Attribute name" select `custom:fullAdmin`
- Set the "Value" to `1`
- Then click "Save changes"
- If the users is already logged in, they need to log out and back in, now they are able to do 3rd line actions
