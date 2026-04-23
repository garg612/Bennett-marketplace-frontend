import { ShieldCheck, MapPin, Zap } from 'lucide-react';

export const WhyChooseUsSection = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-md-primary" />,
      title: "Verified Students Only",
      description: "Every user is verified with a Bennett University email, ensuring a safe community."
    },
    {
      icon: <MapPin className="h-6 w-6 text-md-primary" />,
      title: "No Shipping Hassles",
      description: "Everything happens right here on campus. No packaging, no shipping fees."
    },
    {
      icon: <Zap className="h-6 w-6 text-md-primary" />,
      title: "Lightning Fast",
      description: "Need a textbook for tomorrow's class? Find it today from someone in the next block."
    }
  ];

  return (
    <section className="js-home-section w-full px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-10 text-section font-medium tracking-tight text-md-on-background">Why Choose Us</h2>
        <div className="grid grid-cols-12 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="col-span-12 rounded-[24px] bg-md-surface-container p-8 shadow-md-sm transition-all duration-300 ease-material md:col-span-4 hover:scale-[1.02] hover:shadow-md-md">
              <div className="mb-4 inline-flex rounded-full bg-md-secondary-container p-3">
                {feature.icon}
              </div>
              <div>
                <h3 className="mb-2 text-card-title font-medium tracking-tight text-md-on-background">{feature.title}</h3>
                <p className="text-body leading-relaxed text-md-on-background/75">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};