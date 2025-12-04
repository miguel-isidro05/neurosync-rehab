import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Wifi, Play, Square, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

export function BCIControlPanel() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("disconnected");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const handleVerifyConnection = async () => {
    setConnectionStatus("connecting");
    
    // Simulación de verificación TCP
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% éxito para demo
      
      if (success) {
        setConnectionStatus("connected");
        toast({
          title: "Conexión establecida",
          description: "La conexión TCP se ha verificado correctamente.",
        });
      } else {
        setConnectionStatus("error");
        toast({
          title: "Error de conexión",
          description: "No se pudo establecer la conexión TCP. Verifique el servidor.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleToggleSession = () => {
    if (!isRunning && connectionStatus !== "connected") {
      toast({
        title: "Conexión requerida",
        description: "Debe verificar la conexión TCP antes de iniciar.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(!isRunning);
    
    toast({
      title: isRunning ? "Sesión detenida" : "Sesión iniciada",
      description: isRunning 
        ? "La sesión de neurofeedback ha sido detenida." 
        : "Iniciando adquisición de señales EEG...",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-2xl shadow-soft border border-border p-8 space-y-8">
        {/* Header con estado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground">
              Panel de Control
            </span>
          </div>
          <ConnectionStatus status={connectionStatus} />
        </div>

        {/* Botones de acción */}
        <div className="space-y-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start gap-3"
            onClick={handleVerifyConnection}
            disabled={connectionStatus === "connecting"}
          >
            <Wifi className={connectionStatus === "connected" ? "text-success" : ""} />
            <span className="flex-1 text-left">Verificar Conexión TCP</span>
            {connectionStatus === "connecting" && (
              <span className="text-xs text-muted-foreground">Verificando...</span>
            )}
          </Button>

          <Button
            variant={isRunning ? "destructive" : "gradient"}
            size="xl"
            className="w-full gap-3"
            onClick={handleToggleSession}
          >
            {isRunning ? (
              <>
                <Square className="h-5 w-5" />
                <span>Detener Sesión</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Iniciar Sesión</span>
              </>
            )}
          </Button>
        </div>

        {/* Info adicional */}
        {isRunning && (
          <div className="bg-accent/50 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse-slow" />
              <span className="text-foreground font-medium">
                Sesión activa - Adquiriendo señales EEG
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
