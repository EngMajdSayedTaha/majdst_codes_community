// Hero Section Component
import { useState, useEffect } from 'react';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import { useScrollToSection } from '@hooks/useScrollToSection';
import { useSiteStats } from '@features/site-settings/hooks/useSiteStats';

const SAMPLE_CODE = `function buildWithMajdst() {
  const [skills, setSkills] = useState([]);
  
  return (
    <>{/* Your code here */}</>
  );
}`;

/**
 * HeroSection - Main hero section with gradient background and CTA
 */
const HeroSection = () => {
  const { scrollToSection } = useScrollToSection();
  const { stats } = useSiteStats();
  const [displayedCode, setDisplayedCode] = useState('');

  // Simulate typing effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= SAMPLE_CODE.length) {
        setDisplayedCode(SAMPLE_CODE.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -top-48 -right-48" />
        <div className="absolute w-96 h-96 bg-yellow-400 opacity-3 rounded-full blur-3xl -bottom-48 -left-48" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary bg-primary bg-opacity-10 px-4 py-2 rounded-full">
                  Welcome to majdst.codes 🚀
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Learn, Build & Grow Together
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                Master web development with interactive challenges, curated learning resources, and a supportive community of developers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('dev-cards')}
              >
                Explore Dev Cards
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('challenges')}
              >
                Weekly Challenges
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 flex-wrap">
              {stats.map(stat => (
                <div key={stat.id}>
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Code Card */}
          <div className="hidden lg:block">
            <Card className="bg-gray-900 dark:bg-gray-950 border-gray-800 overflow-hidden">
              <p className="text-sm text-gray-500 mb-4 font-mono">hero.tsx</p>
              <pre className="font-mono text-sm text-green-400 overflow-auto">
                <code>{displayedCode}</code>
                {displayedCode.length < SAMPLE_CODE.length && (
                  <span className="animate-pulse">|</span>
                )}
              </pre>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
