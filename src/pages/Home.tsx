import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-white bg-dot-pattern">
      <Header />
      <Hero />
    </div>
  );
}