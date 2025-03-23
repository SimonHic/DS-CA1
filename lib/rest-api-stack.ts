import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as custom from "aws-cdk-lib/custom-resources";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { generateBatch } from "../shared/util";
import { games, gamePublishers } from "../seed/games";

export class RestAPIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Tables 
    const gamesTable = new dynamodb.Table(this, "GamesTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Games",
    });

    const gamePublisherTable = new dynamodb.Table(this, "GamePublisherTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "gameId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "publisherName", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "GamePublisher",
    });

    gamePublisherTable.addLocalSecondaryIndex({
      indexName: "roleIx",
      sortKey: { name: "publisherCountry", type: dynamodb.AttributeType.STRING },
    });

    // Functions 
    const getGameByIdFn = new lambdanode.NodejsFunction(
      this,
      "GetGameByIdFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/getGameById.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: gamesTable.tableName,
          CAST_TABLE_NAME: gamePublisherTable.tableName,
          REGION: 'eu-west-1',
        },
      }
      );
      
      const getAllGamesFn = new lambdanode.NodejsFunction(
        this,
        "GetAllGamesFn",
        {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_18_X,
          entry: `${__dirname}/../lambdas/getAllGames.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: gamesTable.tableName,
            REGION: 'eu-west-1',
          },
        }
        );

        const newGameFn = new lambdanode.NodejsFunction(this, "AddGameFn", {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_22_X,
          entry: `${__dirname}/../lambdas/addGame.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: gamesTable.tableName,
            REGION: "eu-west-1",
          },
        });

        const deleteGameFn = new lambdanode.NodejsFunction(this, "DeleteGameFn", {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_22_X,
          entry: `${__dirname}/../lambdas/deleteGame.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: gamesTable.tableName,
            REGION: "eu-west-1",
          },
        });

        const getGamePublisherFn = new lambdanode.NodejsFunction(
          this,
          "GetPublisherFn",
          {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_22_X,
            entry: `${__dirname}/../lambdas/getGamePublisher.ts`,
            timeout: cdk.Duration.seconds(10),
            memorySize: 128,
            environment: {
              TABLE_NAME: gamePublisherTable.tableName,
              REGION: "eu-west-1",
            },
          }
        );

        const updateGameFn = new lambdanode.NodejsFunction(this, "UpdateGameFn", {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_22_X,
          entry: `${__dirname}/../lambdas/updateGame.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: gamesTable.tableName,
            REGION: "eu-west-1",
          },
        });

        const translateGameFn = new lambdanode.NodejsFunction(this, "TranslateGameFn", {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_22_X,
          entry: `${__dirname}/../lambdas/translateGame.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: gamesTable.tableName,
            REGION: "eu-west-1",
          },
        });
        translateGameFn.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ["translate:TranslateText"],
            resources: ["*"],
          })
        )
        
        new custom.AwsCustomResource(this, "gamesddbInitData", {
          onCreate: {
            service: "DynamoDB",
            action: "batchWriteItem",
            parameters: {
              RequestItems: {
                [gamesTable.tableName]: generateBatch(games),
                [gamePublisherTable.tableName]: generateBatch(gamePublishers),  // Added
              },
            },
            physicalResourceId: custom.PhysicalResourceId.of("gamesddbInitData"), //.of(Date.now().toString()),
          },
          policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
            resources: [gamesTable.tableArn, gamePublisherTable.tableArn],  // Includes game publisher
          }),
        });
        
        // Permissions 
        gamesTable.grantReadData(getGameByIdFn)
        gamesTable.grantReadData(getAllGamesFn)
        gamesTable.grantReadWriteData(newGameFn)
        gamesTable.grantReadWriteData(deleteGameFn)
        gamesTable.grantReadWriteData(updateGameFn)
        gamesTable.grantReadData(translateGameFn)
        gamePublisherTable.grantReadData(getGameByIdFn)
        gamePublisherTable.grantReadData(getGamePublisherFn);
        
        // REST API 
    const api = new apig.RestApi(this, "RestAPI", {
      description: "demo api",
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    // Games endpoint
    const gamesEndpoint = api.root.addResource("games");
    gamesEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getAllGamesFn, { proxy: true })
    );
    // Detail game endpoint
    const specificGameEndpoint = gamesEndpoint.addResource("{gameId}");
    specificGameEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getGameByIdFn, { proxy: true })
    );
    gamesEndpoint.addMethod(
      "POST",
      new apig.LambdaIntegration(newGameFn, { proxy: true })
    );
    specificGameEndpoint.addMethod(
      "DELETE",
      new apig.LambdaIntegration(deleteGameFn, { proxy: true }),
    );
    specificGameEndpoint.addMethod(
      "PUT",
      new apig.LambdaIntegration(updateGameFn, { proxy: true }),
    );
    const gamePublisherEndpoint = gamesEndpoint.addResource("publisher");

    gamePublisherEndpoint.addMethod(
        "GET",
        new apig.LambdaIntegration(getGamePublisherFn, { proxy: true })
    );
    const gameTranslationEndpoint = specificGameEndpoint.addResource("translation");

    gameTranslationEndpoint.addMethod(
        "GET",
        new apig.LambdaIntegration(translateGameFn, { proxy: true })
    );
      }
    }
    