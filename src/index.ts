import jobListingData from "../data/job-listings.json" assert { type: "json" };;
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import 'dotenv/config';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

export async function loadVectorStore(): Promise<MemoryVectorStore> {
  const documentData: Document[] = jobListingData.map((jobListing) => {
    return {
      pageContent: `location: ${jobListing.props.pageProps.job.location}
        description: ${jobListing.props.pageProps.job.listingDescription}
        industry: ${jobListing.props.pageProps.job.industry}
        startDate: ${jobListing.props.pageProps.job.startDate}
        endDate: ${jobListing.props.pageProps.job.endDate}
        listingTitle: ${jobListing.props.pageProps.job.listingTitle}
        payment: ${jobListing.props.pageProps.job.budget}
        profession: ${jobListing.props.pageProps.job.profession}
        companyName: ${jobListing.props.pageProps.company.name}

      `,
      metadata: {
        id: jobListing.props.pageProps.job.uid,
        industry: jobListing.props.pageProps.job.industry,
        description: jobListing.props.pageProps.job.listingDescription.replace('\n', ' '),
        startDate: jobListing.props.pageProps.job.startDate,
        endDate: jobListing.props.pageProps.job.endDate,
        listingTitle: jobListing.props.pageProps.job.listingTitle,
        payment: jobListing.props.pageProps.job.budget,
        location: jobListing.props.pageProps.job.location,
        profession: jobListing.props.pageProps.job.profession,
        applicationsCount: jobListing.props.pageProps.job.applicationsCount,
        companyName: jobListing.props.pageProps.company.name,
        applicationUrl: `https://www.surelywork.com/listings/${jobListing.props.pageProps.job.uid}`
      }
    }
  })
  
  return MemoryVectorStore.fromDocuments(documentData, new OpenAIEmbeddings());
}

async function queryLLM(vectorStore: MemoryVectorStore, query: string) {
  const chat = new ChatOpenAI({ temperature: 0 });
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are Surely AI. A chat bot for SurelyWork.com that helps people find applicable jobs as Creatives.
      You should be given relevant job listings in the form of a JSON.
      Following the job listings you will be given a prompt from a user.
      If you receive a job listing in the prompt include information about it in your response.
      Feel free to not include some of the listings provided if you think they are not relevant.
      If more than one of the job listings provided is relevant, include information about all of them.
      For every relevant job listing make sure to include the applicationUrl. 
      If none of the job listings are relevant, truthfully respond we don't have any relevant job listings at the moment.
      You are strictly to talk about SurelyWork and its job listings, do not talk about anything else.`,
    ],
    ["system", "Job Listings: {augment}"],
    ["human", "{text}"],
  ]);
  const chainB = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  });

  const vectorResult = await vectorStore.similaritySearch(query, 3);
  // console.log(vectorResult?.map((result) => result.metadata));

  const resB = await chainB.call({
    augment: JSON.stringify(vectorResult?.map((result) => result.metadata)),
    text: query,
  });
  return resB;
}


async function main(query: string) {
  const vectorStore = await loadVectorStore();
  console.log(await queryLLM(vectorStore, query));
}

main("I'm a fashion designer based in Los Angeles.");