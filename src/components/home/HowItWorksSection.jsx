import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorksSection = () => {
  const sectionRef = useRef(null);

  const steps = [
    {
      number: '01',
      title: "Sign Up",
      description: "Create an account using your official @bennett.edu.in email address."
    },
    {
      number: '02',
      title: "Browse or Post",
      description: "Search for items you need, or easily list your own items for sale."
    },
    {
      number: '03',
      title: "Meet on Campus",
      description: "Chat securely and meet up on campus to complete the transaction."
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.js-how-card',
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
        <div className="mb-12 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="text-section font-medium tracking-tight text-md-on-background">How It Works</h2>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <p className="max-w-[480px] text-body text-md-on-background/75">
              A clear three-step flow designed for fast, local exchanges across campus with minimal friction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="js-how-card col-span-12 rounded-[24px] bg-md-surface-container p-6 shadow-md-sm transition-all duration-300 ease-material hover:scale-[1.02] hover:shadow-md-md sm:p-8 lg:col-span-4"
            >
              <div className="mb-8 border-b border-md-outline/35 pb-5">
                <p className="text-subtitle font-medium leading-none text-md-primary">{step.number}</p>
              </div>

              <h3 className="mb-3 text-card-title font-medium tracking-tight text-md-on-background">{step.title}</h3>
              <p className="text-body text-md-on-background/75">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};