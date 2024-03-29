function login(email, password, callback) {
    const AWS = require('aws-sdk');
    const bcrypt = require('bcrypt');

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
            return callback(err);
        } else {
            if (data.Items.length === 0) {
                return callback(new WrongUsernameOrPasswordError(email));
            } else {
                const user = data.Items[0];
                // Use bcrypt to compare the provided password with the hashed password stored in DynamoDB
                bcrypt.compare(password, user.password, function (err, isMatch) {
                    if (err) {
                        return callback(err);
                    } else if (!isMatch) {
                        return callback(new WrongUsernameOrPasswordError(email));
                    } else {
                        // Passwords match, return the user profile
                        return callback(null, {
                            user_id: user.email, // Depending on your user schema, you might want to use a different unique identifier
                            email: user.email
                            // Add additional user profile information here as needed
                        });
                    }
                });
            }
        }
    });
}