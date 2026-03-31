import { ChromaClient, CloudClient } from "chromadb";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// const client = new ChromaClient({
//   ssl: false,
//   host: "localhost",
//   port: 8000, // non-standard port based on your server config
//   database: "default_database",
//   headers: {},
// });
const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY!,
  tenant: process.env.CHROMA_TENANT!,
  database: "Autonomix",
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-embedding-001",
});

const getCollection = async (agentId: string) => {
  const collectionName = `agent_memory_${agentId}`;

  const collection = await client.getOrCreateCollection({
    name: collectionName,
  });

  return collection;
};

export const storeMemory = async (agentId: string, data: string) => {
  const collection = await getCollection(agentId);

  const embedding = await embeddings.embedQuery(data);

  await collection.add({
    ids: [Date.now().toString()],
    embeddings: [embedding],
    documents: [data],
    metadatas: [{ agentId }],
  });
};

export const queryMemory = async (agentId: string, query: string) => {
  const collection = await getCollection(agentId);

  const embedding = await embeddings.embedQuery(query);

  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 5,
    where: { agentId }, // optional depending on collection design
  });

  const docs = results.documents?.flat().filter(Boolean) || [];

  return docs.join("\n");
};
