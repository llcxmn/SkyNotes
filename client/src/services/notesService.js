import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/dynamoDB";

export const createNote = async (noteData) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      noteId: noteData.id || Date.now().toString(),
      userId: noteData.userId,
      title: noteData.title,
      content: noteData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    return params.Item;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const getNote = async (noteId, userId) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      noteId,
      userId,
    },
  };

  try {
    const result = await docClient.send(new GetCommand(params));
    return result.Item;
  } catch (error) {
    console.error("Error getting note:", error);
    throw error;
  }
};