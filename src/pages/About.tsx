import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";
import AboutHero from "@/components/about/AboutHero";
import MissionVision from "@/components/about/MissionVision";
import CoreValues from "@/components/about/CoreValues";
import ImpactStats from "@/components/about/ImpactStats";
import LeadershipTeam from "@/components/about/LeadershipTeam";
import CompanyTimeline from "@/components/about/CompanyTimeline";
import AboutCTA from "@/components/about/AboutCTA";

const About = () => {
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

  const AboutSkeleton = () => (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Skeleton className="h-6 w-32 mx-auto bg-primary/30" />
          <Skeleton className="h-16 w-96 mx-auto bg-gradient-to-r from-muted/70 to-muted/50" />
          <Skeleton className="h-6 w-[600px] mx-auto bg-muted/50" />
        </div>
      </div>
      
      {/* Content Sections Skeleton */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-8 w-64 mx-auto mb-4 bg-muted/60" />
              <Skeleton className="h-4 w-96 mx-auto bg-muted/40" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-4">
                  <Skeleton className="h-48 w-full bg-muted/50" />
                  <Skeleton className="h-6 w-3/4 bg-muted/40" />
                  <Skeleton className="h-4 w-full bg-muted/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (headerFooterLoading) {
    return <AboutSkeleton />;
  }
  return (
    <>
      <Helmet>
        <title>About Formacad | Transforming Education for the Digital Age</title>
        <meta name="description" content="Learn about Formacad's mission to democratize quality education worldwide. Discover our values, leadership team, and impact on 100,000+ learners across 50+ countries." />
        <meta name="keywords" content="about Formacad, online education, EdTech company, digital learning platform, education technology, global learning" />
        <link rel="canonical" href="/about" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <AboutHero />
        
        {/* Mission & Vision */}
        <MissionVision />
        
        {/* Core Values */}
        <CoreValues />
        
        {/* Impact Stats */}
        <ImpactStats />
        
        {/* Leadership Team */}
        <LeadershipTeam />
        
        {/* Company Timeline */}
        <CompanyTimeline />
        
        {/* Call to Action */}
        <AboutCTA />
      </div>
    </>
  );
};
export default About;