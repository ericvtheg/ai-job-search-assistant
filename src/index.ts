import fs from 'fs';
import path from 'path';
import { JobListing } from "./job-listing.js";
import { JSONLoader } from "langchain/document_loaders/fs/json";

// write a function to parse all json files in a directory

function parseJobListingData(): JobListing[] {
    const jobListings: JobListing[] = [];
    const directoryPath = './data';

    // Read the list of files in the directory
    const fileNames = fs.readdirSync(directoryPath);
  
    // Loop through each file
    for (const fileName of fileNames) {
      const filePath = path.join(directoryPath, fileName);
  
      // Check if the file has a .json extension
      if (path.extname(filePath) === '.json') {
        try {
          // Read and parse the JSON file
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const jsonObject = JSON.parse(fileContent) as JobListing;
          jobListings.push(jsonObject);
        } catch (error) {
          console.error(`Error parsing JSON file ${filePath}: ${error.message}`);
        }
      }
    }

    console.log(JSON.stringify(jobListings))
  
    return jobListings;
}

const jobListingData = parseJobListingData();


// tokenize
// chunk
// load chunks into embeddings model
// save embeddings into vector DB
// enable prompting, once prompt is received load prompt into embeddings model
// search using vector DB
// using resulting chunks, augment prompt to LLM