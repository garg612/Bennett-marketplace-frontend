import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

export const MarketplaceStorySection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.js-story-item',
        { autoAlpha: 0, y: motionTokens.sectionRevealYOffset },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.sectionRevealDuration,
          ease: motionTokens.ease,
          stagger: motionTokens.pageRevealStagger,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: motionTokens.sectionRevealStart,
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="js-home-section px-6 py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
        <div className="js-story-item col-span-12 lg:col-span-7">
          <p className="mb-4 text-sm font-semibold text-md-primary sm:mb-6">Why We Built This</p>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-md-on-background sm:text-5xl lg:text-6xl">
            A Marketplace Designed For Real Student Life
          </h2>
        </div>

        <div className="js-story-item col-span-12 lg:col-span-5">
          <div className="h-full rounded-3xl border border-md-outline/15 bg-md-surface-container p-6 shadow-md-sm sm:p-8">
            <p className="text-lg leading-relaxed text-md-on-background/80">
              Campus buying and selling should feel immediate, safe, and local. This platform removes unnecessary noise
              and keeps every exchange inside a trusted Bennett network where students can connect quickly.
            </p>
          </div>
        </div>

        <div className="js-story-item col-span-12 lg:col-span-8">
          <div className="h-full rounded-3xl border border-md-outline/15 bg-md-surface-container-low p-6 shadow-md-sm sm:p-8">
            <p className="text-3xl font-semibold leading-tight text-md-on-background sm:text-4xl">
              Built to help students recover value from what they own and get what they need without leaving campus.
            </p>
          </div>
        </div>

        <div className="js-story-item col-span-12 lg:col-span-4">
          <div className="flex h-full flex-col rounded-3xl border border-md-outline/15 bg-md-secondary-container p-6 text-md-on-secondary-container shadow-md-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide">Mission</p>
            <p className="mt-4 text-2xl font-semibold leading-tight sm:mt-5">
              Structured listings, clear communication, and fast meetups for a better student economy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
