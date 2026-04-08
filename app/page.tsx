'use client';

import { useState, useEffect } from 'react';
import { WarehouseScene } from '@/components/WarehouseScene';
import { DashboardUI } from '@/components/DashboardUI';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // A simple timeout avoids the synchronous setState warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <main className="w-screen h-screen bg-[#090e17]" />;
  }

  return (
    <main className="w-screen h-screen overflow-hidden relative bg-[#090e17]">
      <WarehouseScene />
      <DashboardUI />
    </main>
  );
}
