import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function AiBot({problem}) {
    const [messages, setMessages] = useState([
      { role: 'assistant', parts:[{text: "Hi, How can I help you?"}]},
    ]);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        if (!data.message || data.message.trim().length === 0) return;

        // Add user message
        const userMessage = { role: 'user', parts:[{text: data.message}] };
        setMessages(prev => [...prev, userMessage]);
        reset();

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage],
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            // Add assistant response
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                parts:[{text: "Sorry, there was an error. Please try again."}]
            }]);
        }
    };

    return (
        <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur shadow-xl overflow-hidden min-h-[360px] md:min-h-[420px] max-h-[75vh]">
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-200">Chat AI</span>
                {problem?.title && (
                    <span className="text-[11px] text-slate-400 truncate max-w-[60%]">
                        For: {problem.title}
                    </span>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-black">
                {messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                        <div
                            key={index}
                            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 border shadow-sm ${
                                isUser
                                  ? "bg-sky-500/20 text-sky-50 border-sky-500/40"
                                  : "bg-slate-800/70 text-slate-100 border-slate-700"
                            }`}>
                                <p className={`text-[10px] uppercase tracking-wide mb-1 ${
                                  isUser ? "text-sky-300/80" : "text-slate-400/90"
                                }`}>
                                  {isUser ? "You" : "Assistant"}
                                </p>
                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                    {msg.parts[0].text}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className="border-t border-slate-800 bg-slate-900/70 p-3 md:p-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
                    <input
                        placeholder="Ask me anything about this problem..."
                        className="flex-1 px-4 py-3 md:py-3.5 bg-slate-800/90 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition shadow-inner"
                        {...register("message", { required: false })}
                        autoComplete="off"
                        aria-label="Chat message"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium shadow-sm active:scale-[0.98] transition disabled:opacity-50"
                        disabled={errors.message}
                        aria-label="Send message"
                        title="Send"
                    >
                        <Send size={18} />
                        <span className="hidden md:inline text-sm">Send</span>
                    </button>
                </form>
            </div>
        </section>
    );
}

export default AiBot;