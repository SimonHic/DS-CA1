import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("[EVENT]", JSON.stringify(event));
    
    const gameId = event?.pathParameters?.gameId;
    const body = event.body ? JSON.parse(event.body) : {};

    if (!gameId) {
        return{
            statusCode: 400,
            headers:{"content-type": "application/json"
            },
            body: JSON.stringify({ message: "Missing game ID in the request"})
        };
    }

    await ddbDocClient.send(
        new UpdateCommand({
            TableName: process.env.TABLE_NAME,
            Key: { id: parseInt(gameId)},
            UpdateExpression: "set #title = :title, overview = :overview",
            ExpressionAttributeNames:{
                "#title": "title"
            },
            ExpressionAttributeValues:{
                ":title": body.title,
                ":overview": body.overview
            },
            ReturnValues: "UPDATED_NEW"
        })
    );

    return{
        statusCode: 200,
        headers:{"content-type": "application/json"},
    body: JSON.stringify({message: "Game has been updated successfully"})
  };
  
  }catch (error: any){
    console.log(JSON.stringify(error));
    return{
        statusCode: 500,
        headers: {"content-type": "application/json",
        },
        body: JSON.stringify({error}),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}