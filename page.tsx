// app/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/location')
      .then(res => res.json())
      .then(data => {
        router.push(`/fuel-cost/${data.country.toLowerCase()}/${data.city.toLowerCase()}`);
      });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">Detecting your location...</p>
    </div>
  );
}
