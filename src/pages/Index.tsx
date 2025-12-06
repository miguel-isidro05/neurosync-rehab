import { BCIControlPanel } from "@/components/BCIControlPanel";
import { Mail, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/sensoria.svg" alt="Sensoria logo" className="h-6 w-6" />         

            {/* logo */}
            <div>
              <h1 className="page_title__po7na">Sensoria</h1>

            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Session Control Section */}
          <section className="space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                BCI Spaceship Game
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A game developed for Brain-Computer Interface system using motor imagery and neurofeedback that 
                delivers real-time feedback to enhance neuroplasticity and improve post-stroke motor rehabilitation.
              </p>
            </div>

            {/* Control Panel */}
            <BCIControlPanel />
          </section>

          {/* Features Section */}
          <section className="space-y-8">
            <h2 className="font-display text-xl font-semibold text-foreground text-center">
              Our Approach
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <FeatureCard
                title="Motor Imagery"
                description="Detection of cortical activation through EEG signal processing"
                imageSrc="/motor_imagery.jpg"
                href="https://www.frontiersin.org/journals/aging-neuroscience/articles/10.3389/fnagi.2022.863379/full"
              />
              <FeatureCard
                title="Neurofeedback"
                description="Real-time visual feedback for enhanced training sessions"
                imageSrc="/neurofeedback.jpg"
                href="https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2019.00329/full"
              />
              <FeatureCard
                title="Better training protocols"
                description="Adaptive feedback and gamification improve user engagement and motor learning"
                imageSrc="/training.jpg"
                href="https://www.sciencedirect.com/science/article/pii/S2451958824001416"
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border pt-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2025 Sensoria - BCI Neurorehabilitation System
            </p>
            <p className="text-xs text-muted-foreground">
              Developed for Monash Challenge 2025 by Miguel Isidro Báez
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

type FeatureCardProps = {
  title: string;
  description: string;
  imageSrc?: string;
};

function FeatureCard({ title, description, imageSrc, href }: FeatureCardProps & { href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block hover:-translate-y-1 hover:shadow-lg transition-transform transition-shadow duration-200"
    >
      <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden h-full">
        {/* Image */}
        <div className="aspect-video bg-muted flex items-center justify-center border-b border-border overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">Image Placeholder</span>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5 text-center space-y-2">
          <h3 className="font-display text-base font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
}

function TeamMemberCard({ name, role, email }: { name: string; role: string; email: string }) {
  return (
    <div className="bg-secondary/50 rounded-xl p-4 text-center space-y-3">
      {/* Avatar Placeholder */}
      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center border border-border">
        <span className="text-xs text-muted-foreground">Photo</span>
      </div>
      
      <div className="space-y-1">
        <h4 className="font-display text-sm font-semibold text-foreground">
          {name}
        </h4>
        <p className="text-xs text-muted-foreground">
          {role}
        </p>
      </div>
      
      <a 
        href={`mailto:${email}`}
        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
      >
        <Mail className="h-3 w-3" />
        {email}
      </a>
    </div>
  );
}

export default Index;
