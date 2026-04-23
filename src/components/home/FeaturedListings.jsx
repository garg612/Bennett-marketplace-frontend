import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatPrice } from '../../utils/formatPrice';
import { productService } from '../../services/productService';
import { Spinner } from '../ui/Spinner';
import { motionTokens } from '../../utils/motion';
import { getOptimizedImageUrl } from '../../utils/image';

gsap.registerPlugin(ScrollTrigger);

export const FeaturedListings = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const products = await productService.getFeaturedProducts(4);
        setFeaturedProducts(products);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatured();
  }, []);

  useLayoutEffect(() => {
    if (isLoading || featuredProducts.length === 0) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.js-featured-card',
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

      gsap.utils.toArray('.js-parallax-image').forEach((image) => {
        gsap.to(image, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [featuredProducts, isLoading]);

  return (
    <section ref={sectionRef} className="js-home-section px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 grid grid-cols-12 gap-8 lg:mb-12">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="text-section font-medium tracking-tight text-md-on-background">Featured Listings</h2>
          </div>
          <div className="col-span-12 flex items-end justify-start lg:col-span-4 lg:justify-end">
            <Link
              to="/listings"
              className="focus-ring inline-flex min-h-[44px] items-center rounded-full border border-md-outline bg-md-surface-container px-5 py-3 text-label text-md-on-background transition-all duration-300 ease-material hover:bg-md-secondary-container"
            >
              View All Listings
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/listings/${product.id}`}
                className="js-featured-card group col-span-12 overflow-hidden rounded-[24px] bg-md-surface-container shadow-md-sm transition-all duration-300 ease-material md:col-span-6 lg:col-span-4 hover:scale-[1.02] hover:shadow-md-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-md-surface-container-low">
                  <img
                    src={getOptimizedImageUrl(product.images[0])}
                    alt={product.title}
                    loading="lazy"
                    decoding="async"
                    className="js-parallax-image h-[108%] w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-card-title font-medium tracking-tight text-md-on-background">{product.title}</h3>
                    <span className="rounded-full bg-md-secondary-container px-3 py-1 text-xs font-medium text-md-on-secondary-container">
                      {product.condition}
                    </span>
                  </div>

                  <p className="text-subtitle font-medium leading-none text-md-primary">{formatPrice(product.price)}</p>

                  <div className="border-t border-md-outline/35 pt-3 text-xs text-md-on-background/70">
                    <span>{product.views} Views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};