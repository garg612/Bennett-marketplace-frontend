import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'I sold my first-year books in one evening. The buyer was in the next hostel block.',
    name: 'Aarav Mehta',
    role: 'B.Tech CSE, 3rd Year',
  },
  {
    quote: 'Posting a listing took less than two minutes. The platform is clean and easy to trust.',
    name: 'Riya Khanna',
    role: 'BBA, 2nd Year',
  },
  {
    quote: 'The best part is knowing everyone is from campus, so handoffs feel practical and safe.',
    name: 'Kabir Nanda',
    role: 'B.Tech ECE, 4th Year',
  },
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 4800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { autoAlpha: 0, y: motionTokens.sectionRevealYOffset },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.sectionRevealDuration,
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

  useEffect(() => {
    if (!quoteRef.current) return;

    gsap.fromTo(
      quoteRef.current,
      { autoAlpha: 0, y: motionTokens.pageRevealYOffset },
      { autoAlpha: 1, y: 0, duration: motionTokens.pageRevealDuration, ease: motionTokens.ease }
    );
  }, [activeIndex]);

  return (
    <section ref={sectionRef} className="js-home-section px-6 py-20">
      <div className="mx-auto grid max-w-[1280px] grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <h2 className="text-section font-medium tracking-tight text-md-on-background">Student Voices</h2>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div ref={quoteRef} className="min-h-[260px] rounded-[24px] bg-md-surface-container p-6 shadow-md-sm sm:p-8 lg:min-h-[300px]">
            <p className="text-card-title font-medium leading-tight text-md-on-background sm:text-subtitle lg:text-[36px]">
              {testimonials[activeIndex].quote}
            </p>
            <div className="mt-8 border-t border-md-outline/35 pt-4">
              <p className="text-label text-md-primary">{testimonials[activeIndex].name}</p>
              <p className="mt-1 text-xs text-md-on-background/70">{testimonials[activeIndex].role}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`focus-ring h-3 w-full rounded-full transition-colors duration-300 ease-material ${index === activeIndex ? 'bg-md-primary' : 'bg-md-outline/35'
                  }`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
