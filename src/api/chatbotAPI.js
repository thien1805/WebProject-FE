// src/api/chatbotAPI.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Send message to AI Health Chatbot
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages [{role: 'user'|'assistant', content: '...'}]
 * @returns {Promise<{response: string, error?: string}>}
 */
export async function sendChatMessage(message, conversationHistory = []) {
  try {
    const token = localStorage.getItem("access_token");
    const headers = {
      "Content-Type": "application/json",
    };
    
    // Add auth token if available (optional for chatbot)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/v1/ai/health-qa/`,
      {
        message,
        conversation_history: conversationHistory,
      },
      { headers }
    );

    if (response.data?.response) {
      return { response: response.data.response };
    } else if (response.data?.error) {
      return { error: response.data.error };
    }
    
    return { error: "Unexpected response format" };
  } catch (error) {
    console.error("Chatbot API error:", error);
    const errorMessage = 
      error.response?.data?.error || 
      error.response?.data?.detail ||
      error.message || 
      "Failed to get response from chatbot";
    return { error: errorMessage };
  }
}
