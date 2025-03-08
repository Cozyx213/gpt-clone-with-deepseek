"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // Import the highlighter
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Use a dark theme

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setResponse("");
    setLoading(true);
    setPrompt("");
    const response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok || !response.body) {
      console.error("Failed to connect to streaming API");
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let partialData = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      partialData += chunk;

      const lines = partialData.split("\n"); // Handle streaming JSON
      partialData = lines.pop() || ""; // Keep last partial line for next loop

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          setResponse((prev) => prev + (data.text || ""));
        } catch (error) {
          console.error("Error parsing JSON chunk:", error);
        }
      }
    }

    setLoading(false);
  };

  /**
   * Detects if response contains code (```language\ncode block```)
   * and extracts language & formatted code.
   */
  const formatResponse = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let parts = [];
    let lastIndex = 0;
  
    // Iterate over all code matches
    for (const match of text.matchAll(codeBlockRegex)) {
      const [fullMatch, language, code] = match;
      const matchIndex = match.index || 0;
  
      // Push normal text before the code block
      if (matchIndex > lastIndex) {
        parts.push(
          <p key={lastIndex} className="whitespace-pre-wrap">
            {text.slice(lastIndex, matchIndex)}
          </p>
        );
      }
  
      // Push the detected code block
      parts.push(
        <div key={matchIndex} className="mt-4">
          <p className="text-gray-300">Detected {language || "code"}:</p>
          <SyntaxHighlighter language={language || "plaintext"} style={oneDark}>
            {code}
          </SyntaxHighlighter>
        </div>
      );
  
      lastIndex = matchIndex + fullMatch.length; // Move the index forward
    }
  
    // Push remaining normal text after the last code block
    if (lastIndex < text.length) {
      parts.push(
        <p key={lastIndex} className="whitespace-pre-wrap">
          {text.slice(lastIndex)}
        </p>
      );
    }
  
    return <>{parts}</>;
  };
  

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">AI Chat with Flask + Ollama + DeepSeek-Coder</h1>

      {/* Wrap in a <form> so Enter submits */}
      <form className="w-full max-w-1/2" onSubmit={handleGenerate}>
        <textarea
          className="w-full p-2 border border-gray-500 bg-gray-800 rounded-md"
          placeholder="Enter your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent newline in textarea
              handleGenerate();
            }
          }}
        />
      </form>

      <div className="mt-6 p-4 w-full max-w-1/2 bg-gray-800 border border-gray-700 rounded-md">
        <h2 className="text-lg font-semibold">AI Response:</h2>
        {formatResponse(response)}
      </div>
    </main>
  );
}
