"use client";

import React, { useEffect, useState } from "react";

interface FallingEmoji {
  id: number;
  emoji: string;
  left: number;
  animationDuration: number;
  delay: number;
  size: number;
}

export function EmojiRain() {
  const [emojis, setEmojis] = useState<FallingEmoji[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const emojiTypes = ["🇺🇸", "🦅"];
    const newEmojis: FallingEmoji[] = [];

    // Create 150 emojis for more intensity
    for (let i = 0; i < 150; i++) {
      newEmojis.push({
        id: i,
        emoji: emojiTypes[Math.floor(Math.random() * emojiTypes.length)],
        left: Math.random() * 100,
        animationDuration: 1.5 + Math.random() * 1.5, // 1.5-3 seconds (faster!)
        delay: Math.random() * 4, // 0-4 seconds delay
        size: 20 + Math.random() * 30, // 20-50px
      });
    }

    setEmojis(newEmojis);

    // Stop the rain after 5 seconds
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isActive]);

  if (!isActive && emojis.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute animate-fall"
          style={{
            left: `${emoji.left}%`,
            animationDuration: `${emoji.animationDuration}s`,
            animationDelay: `${emoji.delay}s`,
            fontSize: `${emoji.size}px`,
            top: "-50px",
          }}
          onAnimationEnd={() => {
            setEmojis((prev) => prev.filter((e) => e.id !== emoji.id));
          }}
        >
          {emoji.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(calc(100vh + 100px));
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}