import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateDescription = async (title: string, category: string): Promise<string> => {
  try {
    const prompt = `Write a short, engaging description (2-3 sentences) for a website titled "${title}" in the "${category}" category. The description should be informative, concise, and appealing to users. Focus on what makes this website valuable and unique.`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback to static descriptions if Gemini fails
    const fallbackDescriptions = {
      'Technology': `A cutting-edge ${title} solution that leverages modern technology to provide innovative features and seamless user experience.`,
      'Design': `A beautifully crafted ${title} platform that showcases exceptional design principles and user-centered approach.`,
      'News': `Stay informed with ${title}, your reliable source for the latest news and updates in the industry.`,
      'Education': `Enhance your learning experience with ${title}, a comprehensive educational resource designed for knowledge seekers.`,
      'Entertainment': `Discover endless entertainment possibilities with ${title}, your gateway to fun and engaging content.`,
      'Business': `Boost your business productivity with ${title}, a professional tool designed for modern enterprises.`,
      'Health': `Take control of your wellness journey with ${title}, a trusted resource for health and fitness information.`,
      'Travel': `Explore the world with ${title}, your ultimate travel companion for discovering new destinations and experiences.`
    };

    return fallbackDescriptions[category as keyof typeof fallbackDescriptions] || 
      `Discover ${title}, a valuable resource in the ${category} category that offers unique insights and practical solutions.`;
  }
};
