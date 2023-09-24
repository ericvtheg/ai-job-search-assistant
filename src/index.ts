import fs from 'fs';
import path from 'path';
import { JSONLoader } from "langchain/document_loaders/fs/json";
import jobListingData from "../data/job-listings.json";


// tokenize
// chunk
// load chunks into embeddings model
// save embeddings into vector DB
// enable prompting, once prompt is received load prompt into embeddings model
// search using vector DB
// using resulting chunks, augment prompt to LLM