import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const CTASection = () => {
  return (
    <section className="js-home-section px-6 py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1280px] grid-cols-12 gap-8 rounded-[36px] bg-md-primary px-6 py-10 text-md-on-primary shadow-md-lg sm:px-10 sm:py-12 lg:gap-12 lg:px-12">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Start Selling On Campus Today
          </h2>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:pl-4">
          <p className="max-w-md text-xl leading-relaxed text-md-on-primary/90 sm:text-2xl">
            Turn unused essentials into value and discover what you need from students around you.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link to="/listings" className="w-full">
              <Button size="lg" className="w-full rounded-xl border border-md-on-primary bg-md-on-primary text-md-primary hover:bg-md-on-primary/90 hover:text-md-primary/90">
                Explore Listings
              </Button>
            </Link>
            <Link to="/create-listing" className="w-full">
              <Button
                size="lg"
                className="w-full rounded-xl border border-md-on-primary/70 bg-transparent text-md-on-primary hover:bg-md-on-primary/15"
              >
                Create Listing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
