"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

const messages = [
  {
    id: 1,
    sender: "AI Coach",
    content: "Welcome! I'm your fitness AI assistant. How can I help you today?",
    timestamp: "10:00 AM",
    isUser: false,
  },
  {
    id: 2,
    sender: "You",
    content: "I need help creating a workout plan for building muscle",
    timestamp: "10:01 AM",
    isUser: true,
  },
  {
    id: 3,
    sender: "AI Coach",
    content: "I'd be happy to help you create a muscle-building workout plan! To provide the best recommendations, could you tell me:\n\n1. Your current fitness level (beginner, intermediate, advanced)\n2. How many days per week you can train\n3. Any equipment limitations\n4. Any injuries or areas to avoid",
    timestamp: "10:02 AM",
    isUser: false,
  },
  {
    id: 4,
    sender: "You",
    content: "I'm intermediate level, can train 4 days a week, have access to a full gym, and no injuries",
    timestamp: "10:03 AM",
    isUser: true,
  },
  {
    id: 5,
    sender: "AI Coach",
    content: "Perfect! Based on your availability and experience, I recommend an Upper/Lower split:\n\n**Monday - Upper Power**\n• Bench Press: 4x5\n• Bent Over Row: 4x5\n• Overhead Press: 3x6-8\n• Pull-ups: 3x6-8\n\n**Tuesday - Lower Power**\n• Squats: 4x5\n• Romanian Deadlifts: 3x6-8\n• Leg Press: 3x8-10\n• Leg Curls: 3x10-12\n\n**Thursday - Upper Hypertrophy**\n• Incline DB Press: 4x8-10\n• Cable Rows: 4x8-10\n• Lateral Raises: 3x12-15\n• Bicep Curls: 3x10-12\n• Tricep Extensions: 3x10-12\n\n**Friday - Lower Hypertrophy**\n• Front Squats: 4x8-10\n• Walking Lunges: 3x10 each leg\n• Leg Extensions: 3x12-15\n• Calf Raises: 4x12-15",
    timestamp: "10:04 AM",
    isUser: false,
  },
  {
    id: 6,
    sender: "You",
    content: "This looks great! What about nutrition recommendations?",
    timestamp: "10:05 AM",
    isUser: true,
  },
  {
    id: 7,
    sender: "AI Coach",
    content: "For muscle building, here are my nutrition recommendations:\n\n**Caloric Intake:**\n• Aim for a slight surplus (200-500 calories above maintenance)\n• Track your weight weekly and adjust as needed\n\n**Macros:**\n• Protein: 0.8-1g per pound of body weight\n• Fats: 0.3-0.4g per pound\n• Carbs: Fill remaining calories\n\n**Meal Timing:**\n• 4-5 meals throughout the day\n• Pre-workout: Carbs + moderate protein (2-3 hours before)\n• Post-workout: Protein + carbs within 2 hours\n\n**Hydration:**\n• Minimum 0.5oz per pound of body weight\n• More on training days\n\nWould you like me to create a sample meal plan based on your specific calorie needs?",
    timestamp: "10:06 AM",
    isUser: false,
  },
];

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Chat Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/ai-coach.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">AI Fitness Coach</h2>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[70%] gap-3 ${
                  message.isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.isUser ? "/user.png" : "/ai-coach.png"} />
                  <AvatarFallback>{message.isUser ? "U" : "AI"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-1">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <form className="flex gap-2">
          <Input
            placeholder="Type your message..."
            className="flex-1"
            defaultValue=""
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}