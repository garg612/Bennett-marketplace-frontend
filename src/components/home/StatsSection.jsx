import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: 'Active Students', value: 1200, suffix: '+' },
  { label: 'Listings Posted', value: 8400, suffix: '+' },
  { label: 'Successful Trades', value: 5600, suffix: '+' },
  { label: 'Avg. Response Time', value: 12, suffix: 'm' },
];

export const StatsSection = () => {
  const sectionRef = useRef(null);
  const countersRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      countersRef.current.forEach((counterEl, index) => {
        if (!counterEl) return;

        const targetValue = stats[index].value;
        const display = { value: 0 };

        gsap.to(display, {
          value: targetValue,
          duration: 1.4,
          ease: motionTokens.ease,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: motionTokens.sectionRevealStart,
          },
          onUpdate: () => {
            counterEl.textContent = `${Math.floor(display.value).toLocaleString()}${stats[index].suffix}`;
          },
        });
      });

      gsap.fromTo(
        '.js-stat-item',
        { autoAlpha: 0, y: motionTokens.sectionRevealYOffset },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.sectionRevealDuration,
          stagger: motionTokens.pageRevealStagger,
          ease: motionTokens.ease,
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
        <div className="grid grid-cols-12 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="js-stat-item col-span-12 rounded-[24px] bg-md-surface-container p-6 shadow-md-sm sm:col-span-6 lg:col-span-3"
            >
              <p
                ref={(element) => {
                  countersRef.current[index] = element;
                }}
                className="text-subtitle font-medium leading-none text-md-primary"
              >
                0
              </p>
              <p className="mt-3 text-label text-md-on-background/75">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
