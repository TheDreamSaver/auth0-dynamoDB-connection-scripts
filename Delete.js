function deleteUser(email, callback) {
    const AWS = require('aws-sdk');

    AWS.config.update({
        accessKeyId: configuration.accessKeyId,
        secretAccessKey: configuration.secretAccessKey,
        region: configuration.region
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: configuration.dynamoDBTable,
        Key: {
            email: email
        },
        ConditionExpression: 'attribute_exists(email)'
    };

    docClient.delete(params, function (err, data) {
        if (err) {
            callback(err);
        } else {
            // Successfully deleted the user
            callback(null);
        }
    });
}