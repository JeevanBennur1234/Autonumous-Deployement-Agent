'use client';
import { useState, useEffect } from 'react';

export default function ClientTime() {
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleString());
    
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <span>Loading...</span>;
  }

  return <span>{time}</span>;
}