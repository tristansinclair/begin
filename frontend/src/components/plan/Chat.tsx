'use client';
import React, { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'workout-plan' | 'exercise-suggestion';
}

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your AI fitness coach. I can help you create personalized workout plan based on your goals, available equipment, and schedule. What would you like to work on today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      content: "I want to build muscle and get stronger. I have access to a full gym and can workout 4-5 times per week.",
      sender: 'user',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      content: "Perfect! Building muscle with 4-5 gym sessions per week is an excellent approach. I'd recommend a upper/lower body split or push/pull/legs routine. What's your current experience level with weight training?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 180000),
      type: 'text'
    },
    {
      id: '4',
      content: "I've been lifting for about 2 years, so I'd say intermediate level. I can squat around 225lbs and bench 185lbs.",
      sender: 'user',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    },
    {
      id: '5',
      content: "Great numbers! Based on your experience and goals, I'll create a 4-day upper/lower split that focuses on progressive overload. This will include compound movements like squats, deadlifts, bench press, and rows as your main lifts, plus accessory work for balanced development.",
      sender: 'ai',
      timestamp: new Date(Date.now() - 60000),
      type: 'workout-plan'
    },
    {
      id: '6',
      content: "That sounds perfect! Can you show me what a typical upper body day would look like?",
      sender: 'user',
      timestamp: new Date(Date.now() - 30000),
      type: 'text'
    }
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    // Simple response generator for demo purposes
    const responses = [
      "I understand what you're looking for. Let me create a customized plan for you.",
      "That's a great question! Here's what I recommend based on your goals...",
      "Perfect! I can definitely help you with that. Let me break it down for you.",
      "Based on your current level, here's what would work best for you...",
      "Excellent choice! This approach will help you reach your goals efficiently."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-background border rounded-xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-lg">></span>
          </div>
          <div>
            <h3 className="font-semibold">AI Fitness Coach</h3>
            <p className="text-sm text-muted-foreground">Online " Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-accent rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-card rounded-b-xl">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;