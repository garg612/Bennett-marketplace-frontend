import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

const trustItems = [
  {
    title: 'Verified Bennett Emails',
    detail: 'Accounts are tied to campus identity for a trusted student-only marketplace.',
  },
  {
    title: 'Campus-Only Trading',
    detail: 'All exchanges are designed for in-person handoffs within campus surroundings.',
  },
  {
    title: 'Safe Student Community',
    detail: 'Community-first moderation supports respectful and secure transactions.',
  },
];

export const TrustSection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.js-trust-card',
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
    <section ref={sectionRef} className="js-home-section px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="text-section font-medium tracking-tight text-md-on-background">Safety and Trust</h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {trustItems.map((item, index) => (
            <article key={item.title} className="js-trust-card col-span-12 rounded-[24px] bg-md-surface-container p-6 shadow-md-sm transition-all duration-300 ease-material hover:scale-[1.02] hover:shadow-md-md sm:p-8 lg:col-span-4">
              <p className="mb-5 text-subtitle font-medium leading-none text-md-primary">0{index + 1}</p>
              <h3 className="mb-3 text-card-title font-medium tracking-tight text-md-on-background">{item.title}</h3>
              <p className="text-body text-md-on-background/75">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
