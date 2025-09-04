
import { GoogleGenAI } from "@google/genai";
import type { KnowledgeBase } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI Search will not function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function formatKnowledgeBaseForContext(kb: KnowledgeBase): string {
  return kb.map(section => {
    const pagesContent = section.pages.map(page => {
      const pageText = page.content
        .filter(block => block.type === 'heading' || block.type === 'paragraph')
        .map(block => block.content)
        .join('\n');
      return `### Page: ${page.title}\n${pageText}`;
    }).join('\n\n');
    return `## Section: ${section.title}\n${pagesContent}`;
  }).join('\n\n---\n\n');
}

export const queryKnowledgeBase = async (query: string, knowledgeBase: KnowledgeBase): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI search is not configured. Please set the API_KEY environment variable.";
  }

  const context = formatKnowledgeBaseForContext(knowledgeBase);

  const prompt = `You are a helpful assistant for the 'Revvy' knowledge base.
  Your task is to answer the user's question based *only* on the provided context.
  If the answer is not found in the context, say "I couldn't find information about that in the knowledge base."
  Be concise and helpful.

  CONTEXT:
  ---
  ${context}
  ---

  USER QUESTION: "${query}"

  ANSWER:`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.1,
            topP: 0.95,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error querying Gemini API:", error);
    return "Sorry, I encountered an error while trying to answer your question.";
  }
};