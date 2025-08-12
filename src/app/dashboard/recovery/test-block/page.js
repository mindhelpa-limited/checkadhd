'use client';
import React from 'react';
import BlockStackGame from '../../../../components/games/MoneyStackGame.jsx';

export default function TestBlockGamePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🧱 Block Stack Game Test</h1>
      <BlockStackGame />
    </div>
  );
}