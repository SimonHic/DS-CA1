## Serverless REST Assignment - Distributed Systems.

__Name:__ Simon Hickey

__Demo:__ ... link to your YouTube video demonstration coming soon ......

### Context.

Context: Tabletop Games + Publishers

This REST API manages a collection of tabletop games along with their respective publishers. The following are the two DynamoDB tables and their attributes: 

Games Table item attributes:
+ id - number  (Partition key)
+ original_language - string
+ original_title - string
+ adult - boolean
+ overview - string (Used for language translation feature)
+ release_date - string
+ title - string
+ vote_average - number
+ vote_count - number

GamePublisherTable item attributes:
+ gameId - number  (Partition key)
+ publisherName - string  (Sort Key)
+ publisherCountry - string
+ publisherDescription - string

### App API endpoints.
 
+ POST /games - Add a new game to the Games table.
+ GET /games - Retrieve all games.
+ GET /games/{gameId} - Retrieve the game with a specified gameId.
+ GET /games/{gameId}?publisher=true - Retrieve a specific game with its publisher (Query String Parameter).
+ PUT /games/{gameId} - Update an existing game details.
+ DELETE /games/{gameId} - Delete a specific game.
+ GET /games/{gameId}/translation?language=fr - Retrieve a specified game and translate the overview using the __original_language__ attribute as the **Source** language.
+ GET /games/publisher - Retrieve publisher information. Optional filtering using gameId, publisherName, and publisherCountry using query parameters.


### Features.

#### Translation persistence (if completed)

Translation persistence is **not included** in this version of the project.

#### Custom L2 Construct (if completed)

Custom L2 Constructs are **not used** in this implementation.

#### Multi-Stack app (if completed)

This project implementation uses a **single-stack architecture**.

#### Lambda Layers (if completed)

Lambda Layers are **not included** in this implementation.

#### API Keys. (if completed)

API key authentication is **not included** in this implementation.

###  Extra (If relevant).

**No additional** CDK/serverless features were implemented beyond what was covered in lecturers.

#### References/Resources used

+ Distributed Systems **Serverless-Web-API-lab** used as project foundation.
+ https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/translate/command/TranslateTextCommand/
+ https://completecoding.io/typescript-translation-api/
+ https://stackoverflow.com/questions/52636929/specifying-a-custom-role-for-lambda-with-the-aws-cdk#52653862