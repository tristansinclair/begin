'use client';
import React from 'react';
import { ChatMessage } from './Chat';
import { Button } from '../ui/button';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isWorkoutPlan = message.type === 'workout-plan';
  
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary text-secondary-foreground'
      }`}>
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div className={`rounded-2xl px-4 py-3 relative ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : isWorkoutPlan
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 text-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}>
          {/* Special styling for workout plan messages */}
          {isWorkoutPlan && (
            <div className="flex items-center gap-2 mb-2 text-blue-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium">Workout Plan</span>
            </div>
          )}
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Action buttons for workout plans */}
          {isWorkoutPlan && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-blue-200">
              <Button size="sm" className="text-xs">
                View Full Plan
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Customize
              </Button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message;