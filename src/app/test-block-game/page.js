'use client';
import React from 'react';
// Corrected import path with the capital 'S'
import BlockstackGame from '../../components/games/MoneyStackGame'; 

export default function TestBlockGamePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🧱 Block Stack Game Test</h1>
      <BlockstackGame />
    </div>
  );
}