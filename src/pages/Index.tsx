import { BCIControlPanel } from "@/components/BCIControlPanel";

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
                BCI Neurorehabilitation System
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Brain-Computer Interface system using motor imagery and neurofeedback that 
                delivers real-time feedback to enhance neuroplasticity and improve post-stroke motor rehabilitation.
              </p>
            </div>

            {/* Control Panel */}
            <BCIControlPanel />
          </section>

          {/* Footer */}
          <footer className="border-t border-border pt-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2025 Sensoria - BCI Neurorehabilitation System
            </p>
            <p className="text-xs text-muted-foreground">
              Developed for Universidad Peruana Cayetano Heredia by Miguel Isidro Báez
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
