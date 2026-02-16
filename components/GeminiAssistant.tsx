import React, { useState, useRef, useEffect } from "react";
import { askRamadanAssistant } from "../services/geminiService";
import { Send, User, Bot, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
}

const GeminiAssistant: React.FC = () => {
  const storedName = localStorage.getItem("userName");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: storedName
        ? `Salam ${storedName}! 🌙 How can I support your fasting today?`
        : `Salam! I am Imam AI. Before we begin, may I know your name so I can address you properly?`,
    },
  ]);

  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [isCollectingName, setIsCollectingName] = useState(
    !localStorage.getItem("userName"),
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  useEffect(() => {
    if (name) {
      localStorage.setItem("userName", name);
    }
  }, [name]);

  // const handleSend = async () => {
  //   if (!input.trim() || isLoading) return;

  //   const userMessage = input.trim();
  //   setInput("");
  //   setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
  //   setIsLoading(true);

  //   try {
  //     const response = await askRamadanAssistant(userMessage);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "bot",
  //         content:
  //           response || "I'm sorry, I couldn't process that. Please try again.",
  //       },
  //     ]);
  //   } catch (error) {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "bot",
  //         content:
  //           "An error occurred. Please check your internet connection and try again.",
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // ✅ If we are collecting the name
    if (isCollectingName) {
      setName(userMessage);
      localStorage.setItem("userName", userMessage);
      setIsCollectingName(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `BarakAllahu feek, ${userMessage}. 🌙 
How can I assist you with your Ramadan journey today?`,
        },
      ]);

      return; // Stop here — don’t call API yet
    }

    // Normal AI flow
    setIsLoading(true);

    try {
      const response = await askRamadanAssistant(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            response || "I'm sorry, I couldn't process that. Please try again.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "An error occurred. Please check your internet connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-emerald-800 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 p-2 rounded-xl">
            <Sparkles size={24} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Ask Imam AI</h2>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] text-emerald-300 font-medium uppercase tracking-wider">
                AI Powered Guidance
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === "user"
                    ? "bg-slate-200 text-slate-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-slate-400 text-sm">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <span>Imam AI is reflecting...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about fasting, Suhoor, or prayer guidance..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-3 text-sm py-2"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`p-3 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-2 text-slate-400">
          AI generated guidance should be verified with your local Imam for
          critical matters.
        </p>
      </div>
    </div>
  );
};

export default GeminiAssistant;
