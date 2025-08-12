import Link from 'next/link';

// You can add your own styles here for your unique footer
export default function RecoveryLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Main content area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Recovery-specific Footer */}
      <footer className="p-4 border-t border-gray-700 text-center text-sm text-gray-500">
        © 2025 BlockStack. All rights reserved.
      </footer>
    </div>
  );
}
