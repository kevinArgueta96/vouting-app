'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export const LoadingEmojis = () => {
  const [show, setShow] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [emojis, setEmojis] = useState<Array<{
    id: number;
    emojiNum: number;
    row: number;
    style: {
      left: string;
      top: string;
      scale: number;
    };
  }>>([]);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Generate emoji positions with dense, non-linear distribution
  useEffect(() => {
    const rows = 12;
    const columns = 15;
    const totalEmojis = rows * columns;
    const newEmojis = [];

    // Create a grid of emojis
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const i = row * columns + col;
        
        // Calculate base positions
        const baseX = (col / (columns - 1)) * 100;
        const baseY = (row / (rows - 1)) * 100;
        
        // Add slight randomness to positions
        const randomX = (Math.random() - 0.5) * 4; // Reduced randomness
        const randomY = (Math.random() - 0.5) * 2; // Even less vertical randomness
        
        // Final positions
        const x = Math.max(2, Math.min(98, baseX + randomX));
        const y = Math.max(2, Math.min(98, baseY + randomY));
        
        // Random size variation
        const scale = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        
        newEmojis.push({
          id: i,
          emojiNum: (i % 4) + 1,
          row,
          style: {
            left: `${x}%`,
            top: `${y}%`,
            scale,
          },
        });
      }
    }

    setEmojis(newEmojis);
  }, []);

  // Progressive addition of emojis by rows
  useEffect(() => {
    if (emojis.length === 0) return;

    const rows = Math.max(...emojis.map(emoji => emoji.row)) + 1;
    let currentRow = 0;

    const addRow = () => {
      if (currentRow < rows) {
        const rowEmojis = emojis.filter(emoji => emoji.row <= currentRow);
        setVisibleCount(rowEmojis.length);
        currentRow++;
        
        // Accelerating cascade effect for rows
        const nextDelay = Math.max(50, 200 - (currentRow * 15));
        setTimeout(addRow, nextDelay);
      }
    };

    addRow();
    return () => setVisibleCount(0);
  }, [emojis]);

  return (
    <div className={`fixed inset-0 bg-[#F9F6F0] z-50 transition-opacity duration-500 ${!show ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 overflow-hidden">
        {emojis.slice(0, visibleCount).map(({ id, emojiNum, style }) => (
          <div
            key={id}
            className={`absolute animate-cascade-fall animate-float-${emojiNum}`}
            style={{
              left: style.left,
              top: style.top,
              transform: `translate(-50%, -50%) scale(${style.scale})`,
            }}
          >
            <Image
              src={`/images/emoji_${emojiNum}.png`}
              alt={`Emoji ${emojiNum}`}
              width={100}
              height={100}
              className="w-20 h-20 md:w-24 md:h-24"
              priority={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
