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
      size: number;
      zIndex: number;
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
    const rows = 8;
    const columns = 12;
    const totalEmojis = rows * columns;
    const newEmojis = [];

    // Specific size variations
    const sizes = [80, 120, 160];

    // Create a grid of emojis
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const i = row * columns + col;
        
        // Calculate base positions with increased overlap
        const baseX = ((col / (columns - 1)) * 85) + 7.5; // Spread across 85% of width
        const baseY = ((row / (rows - 1)) * 85) + 7.5; // Spread across 85% of height
        
        // Add more randomness for overlap
        const randomX = (Math.random() - 0.5) * 15; // ±7.5% horizontal variation
        const randomY = (Math.random() - 0.5) * 15; // ±7.5% vertical variation
        
        // Final positions
        const x = Math.max(0, Math.min(100, baseX + randomX));
        const y = Math.max(0, Math.min(100, baseY + randomY));
        
        // Random size from predefined options
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        
        // Z-index variation for better layering
        const zIndex = Math.floor(Math.random() * 10) + (row * 10);
        
        newEmojis.push({
          id: i,
          emojiNum: (i % 4) + 1,
          row,
          style: {
            left: `${x}%`,
            top: `${y}%`,
            size,
            zIndex,
          },
        });
      }
    }

    // Randomize the order within each row for more natural overlap
    const sortedEmojis = newEmojis.sort((a, b) => {
      if (a.row === b.row) {
        return Math.random() - 0.5;
      }
      return a.row - b.row;
    });

    setEmojis(sortedEmojis);
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
        const nextDelay = Math.max(30, 150 - (currentRow * 15));
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
              zIndex: style.zIndex,
              width: `${style.size}px`,
              height: `${style.size}px`,
            }}
          >
            <Image
              src={`/images/emoji_${emojiNum}.png`}
              alt={`Emoji ${emojiNum}`}
              fill
              className="object-contain"
              priority={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
