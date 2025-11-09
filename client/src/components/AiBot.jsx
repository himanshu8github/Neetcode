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
        <div className="flex flex-col h-96 bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
            {/* Messages Container - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.role === "user" 
                                ? 'bg-sky-500/30 text-white border border-sky-500/50' 
                                : 'bg-slate-800 text-slate-200 border border-slate-700'
                        }`}>
                            <p className="text-sm break-words whitespace-pre-wrap">
                                {msg.parts[0].text}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form - Fixed at Bottom */}
            <div className="border-t border-slate-800 bg-slate-900/50 p-4 flex-shrink-0">
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
                    <input 
                        placeholder="Ask me anything..." 
                        className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
                        {...register("message", { required: false })}
                        autoComplete="off"
                    />
                    <button 
                        type="submit" 
                        className="p-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
                        disabled={errors.message}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AiBot;