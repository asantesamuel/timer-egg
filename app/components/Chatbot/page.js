"use client";
import React, { useState } from "react";

const Page = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const askQuestion = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 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",
            "HTTP-Referer": "https://your-app-domain.com",
            "X-Title": "Recipe Assistant",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            messages: [
              // Include conversation history for context
              ...messages.map((msg) => ({
                role: msg.isUser ? "user" : "assistant",
                content: msg.text,
              })),
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message ||
            `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmission = async (e) => {
    e?.preventDefault(); // Handle form submission

    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    // Clear input field right away for better UX
    setInput("");

    // Get AI response
    const aiResponse = await askQuestion(input);

    if (aiResponse) {
      // Add AI response to chat
      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-[600px] bg-amber-50 w-[500px] rounded-xl drop-shadow-lg p-6 border border-amber-200">
      <h1 className="text-xl font-bold text-amber-900 mb-4">
        What are we cooking?
      </h1>

      {/* Chat message display area */}
      <div className="w-full h-[300px] mb-4 rounded-lg border border-amber-200 p-3 overflow-auto bg-white">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">
            Ask me about recipes, cooking tips, or meal ideas!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-2 rounded-lg max-w-[80%] ${
                msg.isUser
                  ? "bg-amber-100 ml-auto"
                  : "bg-white border border-amber-200"
              }`}>
              {msg.text}
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-center text-amber-800 my-2">
            Cooking up a response...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 my-2 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmission} className="w-full">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about a recipe..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="border border-amber-300 rounded-lg p-2 flex-grow"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`bg-amber-500 text-white rounded-lg p-2 min-w-[80px] ${
              isLoading || !input.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-amber-600"
            }`}>
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
