const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
	const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://ruralis.com';
  const tableName = process.env.HOUSES_TABLE_NAME || 'Houses';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin
  };

  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'HTTP Method not allowed' })
      };
    }

    const houseId = event.queryStringParameters && event.queryStringParameters.houseId;

    if (!houseId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing houseId parameter' })
      };
    }

    const params = {
      TableName: tableName,
      Key: {
        houseId: houseId
      }
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'House not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message
      })
    };
  }
};