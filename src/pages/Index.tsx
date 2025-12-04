import { BCIControlPanel } from "@/components/BCIControlPanel";
import { Brain } from "lucide-react";

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
                Sistema de Neurorehabilitación
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Título de sección */}
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Control de Sesión
            </h2>
            <p className="text-muted-foreground">
              Verifique la conexión TCP y gestione las sesiones de neurofeedback
            </p>
          </div>

          {/* Panel de control */}
          <BCIControlPanel />

          {/* Info del sistema */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            <InfoCard
              title="Imaginería Motora"
              description="Detección de activación cortical mediante EEG"
            />
            <InfoCard
              title="Neurofeedback"
              description="Retroalimentación visual en tiempo real"
            />
            <InfoCard
              title="Neuroplasticidad"
              description="Potenciación de rehabilitación post-ACV"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border text-center">
      <h3 className="font-display text-sm font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default Index;
