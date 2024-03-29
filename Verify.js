function verify(email, callback) {
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
        UpdateExpression: 'set email_verified = :v',
        ExpressionAttributeValues: {
            ':v': true
        },
        ReturnValues: 'UPDATED_NEW',
        ConditionExpression: 'attribute_exists(email)' // Check if user email exists
    };

    docClient.update(params, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}