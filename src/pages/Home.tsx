import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f3445]/10 to-blue-950/20">
      <Header />
      <Hero />
    </div>
  );
}