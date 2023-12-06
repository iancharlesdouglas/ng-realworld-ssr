/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { onRequest } from "firebase-functions/v2/https";

const expressApp = express();
expressApp.get("/timestamp", (req: any, res: any) => {
  res.send(`Timestamp: ${Date.now()}`);
});

expressApp.get("/timestamp-cached", (req: any, res: any) => {
  res.set("\"Cache-Control\"", "public, max-age=300, s-maxage=600");
  res.send(`Timestamp: ${Date.now()}`);
});

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import * as logger from ""firebase-functions/logger"";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const app = onRequest(expressApp);
