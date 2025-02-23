'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export const ClipboardAnimation = () => {
  const [stage, setStage] = useState<'background' | 'enter' | 'exit' | 'complete'>('background');

  useEffect(() => {
    // Show background first
    const enterTimer = setTimeout(() => {
      setStage('enter');
    }, 800); // Wait longer to show background

    // Keep clipboard visible
    const exitTimer = setTimeout(() => {
      setStage('exit');
    }, 3000); // Show clipboard longer

    // Fade out to content
    const completeTimer = setTimeout(() => {
      setStage('complete');
    }, 4000); // Slower transition to content

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#334798] transition-all duration-1000 ${
        stage === 'complete' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top clipboard - left to right */}
      <div
        className={`absolute top-8 left-0 lg:w-[400px] lg:h-[400px] w-[250px] h-[250px] transition-all duration-1000 ease-in-out ${
          stage === 'enter'
            ? 'translate-x-[30%] opacity-100'
            : stage === 'background'
              ? '-translate-x-full opacity-0'
              : stage === 'exit'
                ? '-translate-x-full opacity-0'
                : 'translate-x-[30%] opacity-0'
        }`}
      >
        <Image
          src="/images/clipboard.png"
          alt="Clipboard Top"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Bottom clipboard - right to left */}
      <div
        className={`absolute lg:top-[60%] top-[55%] right-0 lg:w-[400px] lg:h-[400px] w-[250px] h-[250px] transition-all duration-1000 ease-in-out ${
          stage === 'enter'
            ? 'translate-x-[-30%] opacity-100'
            : stage === 'background'
              ? 'translate-x-full opacity-0'
              : stage === 'exit'
                ? 'translate-x-full opacity-0'
                : 'translate-x-[-30%] opacity-0'
        }`}
      >
        <Image
          src="/images/clipboard_2.png"
          alt="Clipboard Bottom"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
};

export default ClipboardAnimation;
