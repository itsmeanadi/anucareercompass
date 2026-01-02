import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background dark">
      <Header />
      <Hero />
    </div>
  );
}
