import { BCIControlPanel } from "@/components/BCIControlPanel";
import { Brain, Mail, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-xl shadow-soft">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
                NeuroMotor BCI
              </h1>
              <p className="text-xs text-muted-foreground">
                Neurorehabilitation System
              </p>
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
                Session Control
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Brain-Computer Interface system using motor imagery and neurofeedback that 
                identifies cortical activation through EEG and delivers real-time feedback 
                to enhance neuroplasticity and improve post-stroke motor rehabilitation.
              </p>
            </div>

            {/* Control Panel */}
            <BCIControlPanel />
          </section>

          {/* Features Section */}
          <section className="space-y-8">
            <h2 className="font-display text-xl font-semibold text-foreground text-center">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <FeatureCard
                title="Motor Imagery"
                description="Detection of cortical activation through EEG signal processing"
              />
              <FeatureCard
                title="Neurofeedback"
                description="Real-time visual feedback for enhanced training sessions"
              />
              <FeatureCard
                title="Neuroplasticity"
                description="Enhancement of post-stroke motor rehabilitation outcomes"
              />
            </div>
          </section>

          {/* About Us Section */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="font-display text-xl font-semibold text-foreground">
                About Us
              </h2>
            </div>
            
            <div className="bg-card rounded-2xl shadow-soft border border-border p-8 space-y-6">
              <div className="flex items-center gap-3 justify-center">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-display font-semibold text-foreground">
                  Our Team
                </span>
              </div>
              
              <p className="text-muted-foreground text-center max-w-xl mx-auto">
                We are a multidisciplinary team of researchers and engineers dedicated to 
                developing innovative solutions for neurorehabilitation using cutting-edge 
                brain-computer interface technology.
              </p>

              {/* Team Members Placeholder */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <TeamMemberCard
                  name="Team Member 1"
                  role="Role / Position"
                  email="email1@example.com"
                />
                <TeamMemberCard
                  name="Team Member 2"
                  role="Role / Position"
                  email="email2@example.com"
                />
                <TeamMemberCard
                  name="Team Member 3"
                  role="Role / Position"
                  email="email3@example.com"
                />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 NeuroMotor BCI. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
      {/* Image Placeholder */}
      <div className="aspect-video bg-muted flex items-center justify-center border-b border-border">
        <span className="text-xs text-muted-foreground">Image Placeholder</span>
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
