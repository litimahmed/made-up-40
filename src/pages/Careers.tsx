import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";
import CareersHero from "@/components/careers/CareersHero";
import WhyWorkWithUs from "@/components/careers/WhyWorkWithUs";
import OpenPositions from "@/components/careers/OpenPositions";
import BenefitsSection from "@/components/careers/BenefitsSection";
import CompanyCulture from "@/components/careers/CompanyCulture";
import ApplicationProcess from "@/components/careers/ApplicationProcess";

const Careers = () => {
  const [headerFooterLoading, setHeaderFooterLoading] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'H' || event.key === 'h') {
        const newLoading = !headerFooterLoading;
        setHeaderFooterLoading(newLoading);
        
        // Dispatch custom event to Layout component
        window.dispatchEvent(new CustomEvent('toggleHeaderFooterLoading', {
          detail: { loading: newLoading }
        }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [headerFooterLoading]);

  const CareersSkeleton = () => (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <section className="pt-24 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-24 bg-primary/30" />
                    <Skeleton className="h-16 w-full max-w-md bg-gradient-to-r from-muted/70 to-muted/50" />
                  </div>
                  <Skeleton className="h-16 w-full bg-muted/50" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center space-y-2">
                      <Skeleton className="w-12 h-12 bg-primary/20 rounded-lg mx-auto" />
                      <Skeleton className="h-6 w-12 bg-muted/60 mx-auto" />
                      <Skeleton className="h-4 w-16 bg-muted/40 mx-auto" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-12 w-40 bg-primary/30" />
                  <Skeleton className="h-12 w-48 bg-muted/50" />
                </div>
              </div>
              <div className="relative">
                <Skeleton className="h-96 w-full bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us Skeleton */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-64 mx-auto mb-4 bg-muted/60" />
              <Skeleton className="h-6 w-96 mx-auto bg-muted/40" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-lg p-6 space-y-4 bg-card">
                  <div className="flex items-start justify-between">
                    <Skeleton className="w-12 h-12 bg-primary/20 rounded-lg" />
                    <Skeleton className="h-6 w-20 bg-primary/30 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-muted/60" />
                    <Skeleton className="h-16 w-full bg-muted/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Skeleton */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-48 mx-auto mb-4 bg-muted/60" />
              <Skeleton className="h-6 w-80 mx-auto bg-muted/40" />
            </div>
            <div className="flex justify-center mb-8">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-24 bg-muted/50 rounded-md" />
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-6 space-y-4 bg-card">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-48 bg-muted/60" />
                        <Skeleton className="h-5 w-12 bg-red-500/30 rounded-sm" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-16 bg-muted/40" />
                        <Skeleton className="h-4 w-20 bg-muted/40" />
                        <Skeleton className="h-4 w-16 bg-muted/40" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full bg-muted/40" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-6 w-16 bg-muted/50 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full bg-muted/50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Skeleton */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-64 mx-auto mb-4 bg-muted/60" />
              <Skeleton className="h-6 w-96 mx-auto bg-muted/40" />
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-lg p-6 space-y-6 bg-card">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 bg-primary/20 rounded-lg" />
                    <Skeleton className="h-6 w-32 bg-muted/60" />
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="space-y-1">
                        <Skeleton className="h-5 w-3/4 bg-muted/60" />
                        <Skeleton className="h-8 w-full bg-muted/40" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture Skeleton */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-64 mx-auto mb-4 bg-muted/60" />
              <Skeleton className="h-6 w-96 mx-auto bg-muted/40" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-6 space-y-4 bg-card text-center">
                  <Skeleton className="w-16 h-16 bg-primary/20 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-24 bg-muted/60 mx-auto" />
                  <Skeleton className="h-12 w-full bg-muted/40" />
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <Skeleton className="h-8 w-48 bg-muted/60" />
                <Skeleton className="h-16 w-full bg-muted/40" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="w-2 h-2 bg-primary/30 rounded-full mt-2 flex-shrink-0" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-5 w-24 bg-muted/60" />
                        <Skeleton className="h-8 w-full bg-muted/40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border rounded-lg p-8 bg-card">
                <div className="text-center mb-6">
                  <Skeleton className="w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 bg-muted/60 mx-auto" />
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-6 w-16 bg-muted/50 rounded-sm" />
                      <Skeleton className="h-4 w-32 bg-muted/40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Skeleton */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-48 mx-auto mb-4 bg-muted/60" />
              <Skeleton className="h-6 w-80 mx-auto bg-muted/40" />
            </div>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border rounded-lg p-6 bg-card">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 bg-primary/20 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-12 bg-muted/50 rounded-sm" />
                          <Skeleton className="h-6 w-32 bg-muted/60" />
                          <Skeleton className="h-4 w-20 bg-muted/40" />
                        </div>
                      </div>
                      <Skeleton className="h-16 w-full bg-muted/40" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-24 bg-muted/60" />
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="flex items-start gap-2">
                            <Skeleton className="w-1.5 h-1.5 bg-primary/30 rounded-full mt-2" />
                            <Skeleton className="h-4 w-full bg-muted/40" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4">
                      <Skeleton className="h-5 w-16 bg-muted/60 mb-2" />
                      <Skeleton className="h-12 w-full bg-muted/40" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  if (headerFooterLoading) {
    return <CareersSkeleton />;
  }
  return (
    <>
      <Helmet>
        <title>Careers - Join Formacad | Shape Algeria's Digital Future</title>
        <meta name="description" content="Join Formacad's mission to transform education in Algeria. Explore career opportunities in tech, education, and business. Competitive benefits, professional growth, and social impact." />
        <meta name="keywords" content="careers Algeria, tech jobs Algeria, education jobs, Formacad careers, software engineer Algeria, digital transformation careers" />
        <link rel="canonical" href="/careers" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <CareersHero />
        
        {/* Why Work With Us */}
        <WhyWorkWithUs />
        
        {/* Open Positions */}
        <OpenPositions />
        
        {/* Benefits & Compensation */}
        <BenefitsSection />
        
        {/* Company Culture */}
        <CompanyCulture />
        
        {/* Application Process */}
        <ApplicationProcess />
      </div>
    </>
  );
};

export default Careers;