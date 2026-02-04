import React from 'react';
import Navbar from './components/Navbar';
import CursorGlow from './components/CursorGlow';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import ComparisonSection from './components/ComparisonSection';
import CurriculumStepsSection from './components/CurriculumStepsSection';
import InstructorsSection from './components/InstructorsSection';
import ReviewsSection from './components/ReviewsSection';
import PricingSection from './components/PricingSection';
import LiveViewer from './components/LiveViewer';

export default function App() {
  return (
    <div className="min-h-screen">
      <CursorGlow />
      <LiveViewer />
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <ComparisonSection />
        <CurriculumStepsSection />
        <InstructorsSection />
        <ReviewsSection />
        <PricingSection />
      </main>
    </div>
  );
}