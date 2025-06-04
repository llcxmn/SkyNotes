// resetUsedThisDay.js
// Resets used_this_day to 0 for every user in the Scale table
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const REGION = process.env.AWS_REGION || process.env.REACT_APP_AWS_REGION;
const TABLE = process.env.DYNAMODB_TABLE_SCALE || process.env.REACT_APP_DYNAMODB_TABLE_SCALE;
const NOTES_TABLE = process.env.DYNAMODB_TABLE || process.env.REACT_APP_DYNAMODB_TABLE;

if (!REGION || !TABLE) {
  throw new Error('AWS_REGION and DYNAMODB_TABLE_SCALE must be set in environment variables');
}

const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
});
const docClient = DynamoDBDocumentClient.from(client);

async function resetAllUsedThisDay() {
  let lastEvaluatedKey = undefined;
  let totalReset = 0;
  do {
    const params = {
      TableName: TABLE,
    };
    if (lastEvaluatedKey) params.ExclusiveStartKey = lastEvaluatedKey;
    const { Items, LastEvaluatedKey } = await docClient.send(new ScanCommand(params));
    if (Items && Items.length > 0) {
      for (const user of Items) {
        await docClient.send(new PutCommand({
          TableName: TABLE,
          Item: {
            ...user,
            used_this_day: 0
          }
        }));
        totalReset++;
      }
    }
    lastEvaluatedKey = LastEvaluatedKey;
  } while (lastEvaluatedKey);
  return totalReset;
}

// Permanently delete all notes in trash (deleted: true)
async function deleteOldTrashedNotes() {
  if (!NOTES_TABLE) throw new Error('DYNAMODB_TABLE must be set in environment variables');
  let lastEvaluatedKey = undefined;
  let deletedCount = 0;
  do {
    const params = {
      TableName: NOTES_TABLE,
      FilterExpression: '#deleted = :trueVal',
      ExpressionAttributeNames: { '#deleted': 'deleted' },
      ExpressionAttributeValues: { ':trueVal': true }
    };
    if (lastEvaluatedKey) params.ExclusiveStartKey = lastEvaluatedKey;
    const { Items, LastEvaluatedKey } = await docClient.send(new ScanCommand(params));
    if (Items && Items.length > 0) {
      for (const note of Items) {
        await docClient.send(new DeleteCommand({
          TableName: NOTES_TABLE,
          Key: { userId: note.userId, noteId: note.noteId }
        }));
        deletedCount++;
      }
    }
    lastEvaluatedKey = LastEvaluatedKey;
  } while (lastEvaluatedKey);
  return deletedCount;
}

module.exports = { resetAllUsedThisDay, deleteOldTrashedNotes };
