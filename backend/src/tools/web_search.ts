import axios from "axios";

export const webSearch = async (query: string) => {
  try {
    const response = await axios.post("https://api.tavily.com/search", {
      api_key: process.env.TAVILY_API_KEY,
      query: query,
      search_depth: "advanced",
      include_answer: true,
      max_results: 5,
    });

    const data = response.data;

    let resultText = "";

    if (data.answer) {
      resultText += `Summary:\n${data.answer}\n\n`;
    }

    if (data.results) {
      resultText += "Sources:\n";
      data.results.forEach((r: any, index: number) => {
        resultText += `${index + 1}. ${r.title}\n${r.url}\n${r.content}\n\n`;
      });
    }

    return resultText || "No results found.";
  } catch (error: any) {
    console.error("Web Search Error:", error.message);
    return "Web search failed.";
  }
};
