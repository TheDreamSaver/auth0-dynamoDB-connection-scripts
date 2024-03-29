function changePassword(email, newPassword, callback) {
    const AWS = require('aws-sdk');
    const bcrypt = require('bcrypt');

    AWS.config.update({
        accessKeyId: configuration.accessKeyId,
        secretAccessKey: configuration.secretAccessKey,
        region: configuration.region
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    // First, hash the new password
    bcrypt.hash(newPassword, 10, function (err, hashedPassword) {
        if (err) {
            return callback(err);
        }

        const params = {
            TableName: configuration.dynamoDBTable,
            Key: {
                email: email
            },
            UpdateExpression: 'set password = :p',
            ExpressionAttributeValues: {
                ':p': hashedPassword
            },
            ReturnValues: 'UPDATED_NEW'
        };

        // Next, update the old password
        docClient.update(params, function (err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
    });
}