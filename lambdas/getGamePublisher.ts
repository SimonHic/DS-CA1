import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { GamePublisherQueryParams } from "../shared/types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv";
import schema from "../shared/types.schema.json";

const ajv = new Ajv();
const isValidQueryParams = ajv.compile(
  schema.definitions["GamePublisherQueryParams"] || {}
);
 
const ddbDocClient = createDocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("[EVENT]", JSON.stringify(event));
    const queryParams = event.queryStringParameters;
    if (!queryParams) {
      return {
        statusCode: 500,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Missing query parameters" }),
      };
    }
    if (!isValidQueryParams(queryParams)) {
      return {
        statusCode: 500,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: `Incorrect type. Must match Query parameters schema`,
          schema: schema.definitions["GamePublisherQueryParams"],
        }),
      };
    }
    
    const gameId = parseInt(queryParams.gameId);
    let commandInput: QueryCommandInput = {
      TableName: process.env.TABLE_NAME,
    };
    if ("publisherCountry" in queryParams) {
      commandInput = {
        ...commandInput,
        IndexName: "roleIx",
        KeyConditionExpression: "gameId = :g and begins_with(publisherCountry, :r) ",
        ExpressionAttributeValues: {
          ":g": gameId,
          ":r": queryParams.publisherCountry,
        },
      };
    } else if ("publisherName" in queryParams) {
      commandInput = {
        ...commandInput,
        KeyConditionExpression: "gameId = :g and begins_with(publisherName, :a) ",
        ExpressionAttributeValues: {
          ":g": gameId,
          ":a": queryParams.publisherName,
        },
      };
    } else {
      commandInput = {
        ...commandInput,
        KeyConditionExpression: "gameId = :g",
        ExpressionAttributeValues: {
          ":g": gameId,
        },
      };
    }
    
    const commandOutput = await ddbDocClient.send(
      new QueryCommand(commandInput)
      );
      
      return {
        statusCode: 200,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          data: commandOutput.Items,
        }),
      };
    } catch (error: any) {
      console.log(JSON.stringify(error));
      return {
        statusCode: 500,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ error }),
      };
    }
  };
  
  function createDocumentClient() {
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
