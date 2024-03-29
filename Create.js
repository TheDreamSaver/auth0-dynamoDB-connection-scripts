function create(user, callback) {
    const AWS = require('aws-sdk');
    const bcrypt = require('bcrypt');

    AWS.config.update({
        accessKeyId: configuration.accessKeyId,
        secretAccessKey: configuration.secretAccessKey,
        region: configuration.region
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    // Generate a salt and hash the password
    bcrypt.hash(user.password, 10, function (err, hashedPassword) {
        if (err) {
            return callback(err);
        }

        const params = {
            TableName: configuration.dynamoDBTable,
            Item: {
                email: user.email,
                password: hashedPassword,
                // Add any other user attributes here
            },
            ConditionExpression: 'attribute_not_exists(email)' // Ensure the user does not already exist
        };

        docClient.put(params, function (err, data) {
            if (err) {
                if (err.code === 'ConditionalCheckFailedException') {
                    // This error means the user already exists
                    callback(new Error('User already exists'));
                } else {
                    callback(err);
                }
            } else {
                // User was created successfully
                callback(null);
            }
        });
    });
}