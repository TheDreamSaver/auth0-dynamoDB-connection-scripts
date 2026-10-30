# Auth0 custom database scripts for Amazon DynamoDB

Use an existing DynamoDB user store with an Auth0 Custom Database Connection. These examples cover authentication, user creation, profile lookup, password changes, email verification and deletion.

## Scripts

| File | Auth0 action | What it does |
| --- | --- | --- |
| [Login.js](Login.js) | Login | Looks up a user by email and checks the stored bcrypt password hash. |
| [Create.js](Create.js) | Create | Hashes a password with bcrypt and creates the user record. |
| [GetUser.js](GetUser.js) | Get User | Returns the profile associated with an email address. |
| [ChangePassword.js](ChangePassword.js) | Change Password | Replaces the password with a new bcrypt hash. |
| [Verify.js](Verify.js) | Verify | Marks the email address as verified. |
| [Delete.js](Delete.js) | Delete | Deletes the user record. |

## Set up the connection

1. Create a DynamoDB table with a string partition key named `email`. The examples assume there is no sort key. Adapt the scripts if your existing table uses a different schema.
2. Create an Auth0 Database Connection and enable **Use my own database** in its Custom Database settings.
3. Copy each script into its corresponding action editor.
4. Add the following values to the connection’s **Settings** section. Auth0 exposes them to the scripts through the `configuration` object.

| Setting | Value |
| --- | --- |
| `region` | AWS region containing the DynamoDB table. |
| `accessKeyId` | Access key ID for the IAM identity used by the connection. |
| `secretAccessKey` | Secret access key for that IAM identity. |
| `dynamoDBTable` | DynamoDB table name. |

The scripts use `dynamodb:Query`, `dynamodb:PutItem`, `dynamodb:UpdateItem` and `dynamodb:DeleteItem`. Scope the IAM policy to the required actions and table. Keep credentials in the Auth0 connection settings.

## Expected user records

- `email`: string partition key, also returned as the Auth0 `user_id`.
- `password`: bcrypt password hash. Existing records must use a compatible hash for the sample login script.
- `email_verified`: boolean used by the profile and verification scripts.

If you use a separate stable user ID, adapt the returned `user_id` to match it before connecting existing accounts.

## Runtime and validation

These examples use AWS SDK for JavaScript v2 (`aws-sdk`), `bcrypt` and Auth0’s custom database script environment. Review current runtime and dependency support in your Auth0 tenant before deployment.

Use a separate test table and Auth0’s script test tools to check successful and failed logins, duplicate creation, password changes, email verification and deletion. This repository contains the scripts and has no automated integration test suite.

More about my identity and authorization work: [ashishjha.ai/work](https://ashishjha.ai/work).
