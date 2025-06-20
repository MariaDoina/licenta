"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import axios from "axios";

type Message = { from: "user" | "bot"; text: string };
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [pendingIngredient, setPendingIngredient] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleOpen = () => setOpen(!open);

  useEffect(() => {
    if (open && !greeted) {
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "Hi! How can I help you today?" },
        ]);
        setGreeted(true);
      }, 500);
    }
  }, [open, greeted]);

  const handleResponse = (data: any) => {
    const ingredients = data.ingredients;
    const details = data.details;

    let botText = "";
    let total = 0;

    const totalKey =
      Object.keys(data).find((k) => k.startsWith("total_")) || "total";
    const nutrient = totalKey.replace("total_", "");

    for (const ingredient of ingredients) {
      const value = details[ingredient];
      const totalNutrientKey = `total_${nutrient}`;

      if (value && value[totalNutrientKey] !== undefined) {
        botText += `The ingredient "${ingredient}" has ${value[totalNutrientKey]} ${nutrient}.\n`;
        total += value[totalNutrientKey];
      } else if (value && value.error) {
        botText += `Error for "${ingredient}": ${value.error}\n`;
      }
    }

    botText += `\nTotal ${nutrient}: ${total}`;
    setMessages((msgs) => [
      ...msgs,
      { from: "bot", text: botText },
      {
        from: "bot",
        text: "Values may be inaccurate. Please consult a nutritionist for precise information.",
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const rawInput = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: rawInput }]);
    setInput("");
    setLoading(true);

    try {
      let fullText = rawInput;

      // If we expect grams for a pending ingredient
      if (pendingIngredient) {
        const match = rawInput.match(/(\d+(?:\.\d+)?)\s*(g|grams)?/i);
        if (!match) {
          setMessages((msgs) => [
            ...msgs,
            {
              from: "bot",
              text: "Please enter a valid number in grams (e.g., 200g).",
            },
          ]);
          setLoading(false);
          return;
        }

        const grams = match[1];
        fullText = `I ate ${grams} grams of ${pendingIngredient}`;
        setPendingIngredient(null);
      }

      const response = await axios.post(
        "https://modelai-v37f.onrender.com/qa",
        {
          input_text: fullText,
        }
      );
      const data = response.data;

      if (data.missing_quantity_for && !data.error) {
        const ingredient = data.missing_quantity_for;

        setPendingIngredient(ingredient);
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: data.message,
          },
        ]);
      } else if (data.error) {
        setMessages((msgs) => [...msgs, { from: "bot", text: data.error }]);
      } else {
        handleResponse(data);
      }
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Server error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
    <>
      <button
        onClick={toggleOpen}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-50 rounded-full w-14 h-14 bg-blue-600 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
      >
        <span className="font-mono">{open ? "×" : "💬"}</span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 min-h-[300px] max-h-[60vh] bg-white rounded-lg shadow-lg flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 text-sm whitespace-pre-line flex flex-col-reverse">
            <div ref={messagesEndRef} />
            {messages
              .slice()
              .reverse()
              .map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 flex ${
                    msg.from === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] ${
                      msg.from === "bot"
                        ? "bg-gray-200 text-gray-900"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
          </div>

          {loading && (
            <div className="text-gray-500 italic px-4 py-2 border-t border-gray-300">
              Bot is typing...
            </div>
          )}

          <div className="border-t border-gray-300 p-3 flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={2}
              className="flex-1 h-12 resize-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 text-white px-4 rounded-md disabled:bg-blue-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
