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
    
    // TCP verification simulation
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success for demo
      
      if (success) {
        setConnectionStatus("connected");
        toast({
          title: "Connection established",
          description: "TCP connection has been verified successfully.",
        });
      } else {
        setConnectionStatus("error");
        toast({
          title: "Connection error",
          description: "Could not establish TCP connection. Please verify the server.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleToggleSession = () => {
    if (!isRunning && connectionStatus !== "connected") {
      toast({
        title: "Connection required",
        description: "You must verify the TCP connection before starting.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(!isRunning);
    
    toast({
      title: isRunning ? "Session stopped" : "Session started",
      description: isRunning 
        ? "The neurofeedback session has been stopped." 
        : "Starting EEG signal acquisition...",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-2xl shadow-soft border border-border p-8 space-y-8">
        {/* Header with status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground">
              Control Panel
            </span>
          </div>
          <ConnectionStatus status={connectionStatus} />
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start gap-3"
            onClick={handleVerifyConnection}
            disabled={connectionStatus === "connecting"}
          >
            <Wifi className={connectionStatus === "connected" ? "text-success" : ""} />
            <span className="flex-1 text-left">Verify TCP Connection</span>
            {connectionStatus === "connecting" && (
              <span className="text-xs text-muted-foreground">Verifying...</span>
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
                <span>Stop Session</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Start Session</span>
              </>
            )}
          </Button>
        </div>

        {/* Additional info */}
        {isRunning && (
          <div className="bg-accent/50 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse-slow" />
              <span className="text-foreground font-medium">
                Active session - Acquiring EEG signals
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
