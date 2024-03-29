function getByEmail(email, callback) {
    const AWS = require('aws-sdk');

    AWS.config.update({
        accessKeyId: configuration.accessKeyId,
        secretAccessKey: configuration.secretAccessKey,
        region: configuration.region
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: configuration.dynamoDBTable,
        KeyConditionExpression: 'email = :e',
        ExpressionAttributeValues: {
            ':e': email
        }
    };

    docClient.query(params, function (err, data) {
        if (err) {
            callback(err);
        } else {
            if (data.Items.length === 0) {
                callback(null);
            } else {
                const user = data.Items[0];
                // Return the user profile. Adjust the returned attributes as needed.
                callback(null, {
                    user_id: user.email, // Use a unique identifier for the user_id
                    email: user.email,
                    email_verified: user.email_verified,
                    // Add other user attributes here as needed
                });
            }
        }
    });
}