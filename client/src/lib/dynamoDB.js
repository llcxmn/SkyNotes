import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

if (!process.env.REACT_APP_DYNAMODB_TABLE) {
  throw new Error("REACT_APP_DYNAMODB_TABLE is not defined in environment variables");
}

if (!process.env.REACT_APP_AWS_REGION) {
  throw new Error("REACT_APP_AWS_REGION is not defined in environment variables");
}

const client = new DynamoDBClient({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);

export async function createNote(noteData) {
  try {
    const command = new PutCommand({
      TableName: process.env.REACT_APP_DYNAMODB_TABLE,
      Item: noteData
    });

    console.log("Sending to DynamoDB with table:", process.env.REACT_APP_DYNAMODB_TABLE);
    return await docClient.send(command);
  } catch (error) {
    console.error("Detailed DynamoDB error:", {
      error,
      tableName: process.env.REACT_APP_DYNAMODB_TABLE,
      region: process.env.REACT_APP_AWS_REGION
    });
    throw error;
  }
}

export async function getUserNotes(userId) {
  const command = new QueryCommand({
    TableName: process.env.REACT_APP_DYNAMODB_TABLE,
    IndexName: "userId-index", // must match the GSI name you created
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId
    }
  });

  try {
    const response = await docClient.send(command);
    return response.Items || [];
  } catch (error) {
    console.error("Detailed query error:", {
      error,
      tableName: process.env.REACT_APP_DYNAMODB_TABLE,
      query: {
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: { ":uid": userId }
      }
    });
    throw error;
  }
}

export async function deleteNote(userId, noteId) {
  // IMPORTANT: Update key names if your DynamoDB table uses different names (e.g., userID, noteID)
  const command = new DeleteCommand({
    TableName: process.env.REACT_APP_DYNAMODB_TABLE,
    Key: { userId: String(userId), noteId: String(noteId) }
  });
  return client.send(command);
}

// Fetch user's note_per_day limit from the scale table
export async function getUserScale(userId) {
  if (!process.env.REACT_APP_DYNAMODB_TABLE_SCALE) {
    throw new Error("REACT_APP_DYNAMODB_TABLE_SCALE is not defined in environment variables");
  }
  const command = new QueryCommand({
    TableName: process.env.REACT_APP_DYNAMODB_TABLE_SCALE,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId
    }
  });
  try {
    const response = await docClient.send(command);
    // Assume only one item per user
    return response.Items && response.Items.length > 0 ? response.Items[0] : null;
  } catch (error) {
    console.error("Error fetching user scale:", error);
    throw error;
  }
}

// Upsert user's note_per_day and used_this_day in the scale table
export async function upsertUserScale(userId, notePerDay, usedThisDay) {
  if (!process.env.REACT_APP_DYNAMODB_TABLE_SCALE) {
    throw new Error("REACT_APP_DYNAMODB_TABLE_SCALE is not defined in environment variables");
  }
  const command = new PutCommand({
    TableName: process.env.REACT_APP_DYNAMODB_TABLE_SCALE,
    Item: {
      userId,
      note_per_day: notePerDay,
      used_this_day: usedThisDay
    }
  });
  try {
    return await docClient.send(command);
  } catch (error) {
    console.error("Error upserting user scale:", error);
    throw error;
  }
}