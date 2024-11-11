import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check
const transcripts: Map<string, unknown> = new Map<string, unknown>();

/** 
 * Returns a greeting message if "name" is provided in query params
 * @param req request to respond to
 * @param res object to send response with
 */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }

  res.send({greeting: `Hi, ${name}`});
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

/**
 * Stores the provided name and value in the transcript.
 * @param req - The request object that includes the name and value.
 * @param res - The response object used to send the result.
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  const content = req.body.content;
  
  if (name === undefined || typeof name !== 'string' || content === undefined) {
    res.status(400).send({ error: 'Missing body' });  // Updated error message
    return;
  }

  const saved = transcripts.has(name);
  transcripts.set(name, content);
  res.send({ saved: !saved });
};

/**
 * Retrieves the content associated with a specific name from the transcript.
 * @param req - The request object that includes the name parameter.
 * @param res - The response object used to send the result.
 * @returns - Sends the retrieved content if it exists, otherwise sends an error message.
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const result = first(req.query.name);
  
  if (result === undefined) {
    res.status(400).send({ error: 'Missing body' });
    return;
  }

  if (transcripts.has(result)) {
    const content = transcripts.get(result);
    res.send({ name: result, content });
  } else {
    res.status(404).send({ error: 'Name not found' });
  }
};

/**
 * Provides a list of all names currently in the transcript.
 * @param req - The request object.
 * @param res - The response object used to send the list of names.
 */
export const names = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({ names: Array.from(transcripts.keys()) });
};

/**
 * Removes all transcripts from the map. This is primarily used for testing purposes.
 */
export const reset = (): void => {
  transcripts.clear();
};

