import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { motionTokens } from '../../utils/motion';

export const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.js-hero-heading-line',
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: motionTokens.pageRevealDuration,
          ease: motionTokens.ease,
          stagger: motionTokens.pageRevealStagger,
        }
      );

      gsap.fromTo(
        '.js-hero-subtext',
        { autoAlpha: 0, y: motionTokens.pageRevealYOffset },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.pageRevealDuration,
          delay: 0.25,
          ease: motionTokens.ease,
        }
      );

      gsap.fromTo(
        '.js-hero-cta',
        { autoAlpha: 0, y: motionTokens.pageRevealYOffset },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.pageRevealDuration,
          delay: 0.35,
          ease: motionTokens.ease,
          stagger: motionTokens.pageRevealStagger,
        }
      );

      gsap.fromTo(
        '.js-hero-aside',
        { autoAlpha: 0, x: 30 },
        {
          autoAlpha: 1,
          x: 0,
          duration: motionTokens.pageRevealDuration,
          delay: 0.35,
          ease: motionTokens.ease,
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="js-home-section px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[48px] bg-md-surface-container px-6 py-14 shadow-md-md sm:px-10 lg:px-14">
          <div className="md-organic-shape primary -left-20 -top-20 h-64 w-64" />
          <div className="md-organic-shape secondary -right-16 bottom-4 h-72 w-72" />
          <div className="relative z-10 grid grid-cols-12 items-start gap-8">
            <div className="col-span-12 lg:col-span-8">
              <div className="border-l-4 border-md-primary pl-4 md:pl-6">
                <h1 className="text-hero font-medium tracking-tight text-md-on-background sm:text-[64px] lg:text-[72px]">
                  <span className="block overflow-hidden">
                    <span className="js-hero-heading-line block">Your Campus</span>
                  </span>
                  <span className="block overflow-hidden">
                    <span className="js-hero-heading-line block text-md-primary">Your Marketplace</span>
                  </span>
                </h1>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="js-hero-aside flex h-full flex-col items-start justify-center">
                <p className="js-hero-subtext max-w-[420px] text-body text-md-on-background/80 sm:text-lg">
                  A focused, student-first marketplace built for Bennett University. Discover verified campus listings,
                  post in minutes, and trade where you already are.
                </p>

                <div className="flex gap-4 mt-6 flex-wrap">
                  <Link to="/listings" className="js-hero-cta w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto">
                      Browse Listings
                    </Button>
                  </Link>
                  {isAuthenticated && (
                    <Link to="/create-listing" className="js-hero-cta w-full sm:w-auto">
                      <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                        Post an Item
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};