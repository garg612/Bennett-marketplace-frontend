import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { HeroSection } from '../components/home/HeroSection';
import { StatsSection } from '../components/home/StatsSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { FeaturedListings } from '../components/home/FeaturedListings';
import { MarketplaceStorySection } from '../components/home/MarketplaceStorySection';
import { TrustSection } from '../components/home/TrustSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CTASection } from '../components/home/CTASection';
import { motionTokens } from '../utils/motion';

gsap.registerPlugin(ScrollTrigger);

export const HomePage = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.15,
    });

    lenis.on('scroll', ScrollTrigger.update);

    let rafId;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.js-home-section');

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: motionTokens.sectionRevealYOffset },
          {
            autoAlpha: 1,
            y: 0,
            duration: motionTokens.sectionRevealDuration,
            ease: motionTokens.ease,
            scrollTrigger: {
              trigger: section,
              start: motionTokens.sectionRevealStart,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={pageRef} className="md-page pb-20">
      <div className="md-organic-shape primary -left-28 top-20 h-80 w-80" />
      <div className="md-organic-shape secondary -right-36 top-[28rem] h-[420px] w-[420px]" />
      <div className="md-organic-shape tertiary left-[40%] bottom-16 h-72 w-72" />
      <div className="md-content-layer">
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FeaturedListings />
        <MarketplaceStorySection />
        <TrustSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </div>
  );
};