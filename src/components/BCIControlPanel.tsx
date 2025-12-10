import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Wifi, Radio, Play, Brain, Globe, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

export function BCIControlPanel() {
  const [lslStatus, setLslStatus] = useState<ConnectionState>("disconnected");
  const [tcpStatus, setTcpStatus] = useState<ConnectionState>("disconnected");
  const { toast } = useToast();

  const handleVerifyLSL = async () => {
    setLslStatus("connecting");
    
    try {
      // TODO: Implement actual LSL connection verification
      // Simulating for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success/failure (replace with actual implementation)
      const success = Math.random() > 0.3;
      
      if (success) {
        setLslStatus("connected");
        toast({
          title: "LSL Connection Verified",
          description: "OpenBCI GUI stream detected successfully.",
        });
      } else {
        setLslStatus("error");
        toast({
          title: "LSL Connection Failed",
          description: "Could not detect OpenBCI GUI stream. Make sure it's running.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setLslStatus("error");
      toast({
        title: "LSL Connection Error",
        description: "Failed to verify LSL connection.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyTCP = async () => {
    setTcpStatus("connecting");
    
    try {
      const response = await fetch("http://localhost:8000/verify-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.connected) {
        setTcpStatus("connected");
        toast({
          title: "TCP Connection Verified",
          description: `Unity connection established. Client: ${data.client_address || "Unknown"}`,
        });
      } else {
        setTcpStatus("error");
        toast({
          title: "TCP Connection Failed",
          description: "Unity is not connected. Please start the Unity application.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setTcpStatus("error");
      toast({
        title: "TCP Connection Error",
        description: "Could not verify TCP connection. Make sure the server is running.",
        variant: "destructive",
      });
    }
  };

  const handleGrazProtocol = () => {
    toast({
      title: "Graz Protocol",
      description: "Starting Graz Protocol calibration session...",
    });
    // TODO: Implement Graz Protocol functionality
  };

  const handleModelTraining = () => {
    toast({
      title: "Model Training",
      description: "Initializing model training process...",
    });
    // TODO: Implement Model Training functionality
  };

  const handleOnlineScenario = () => {
    if (lslStatus !== "connected" || tcpStatus !== "connected") {
      toast({
        title: "Connection Required",
        description: "Please verify both LSL and TCP connections before starting the online scenario.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Online Scenario",
      description: "Launching online BCI scenario...",
    });
    // TODO: Implement Online Scenario functionality
  };

  const bothConnected = lslStatus === "connected" && tcpStatus === "connected";

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card rounded-2xl shadow-soft border border-border p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display font-semibold text-foreground">
            Control Panel
          </span>
        </div>

        {/* Connection Verification Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Connection Verification
          </h3>
          
          <div className="space-y-3">
            {/* LSL Connection */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 justify-start gap-3"
                onClick={handleVerifyLSL}
                disabled={lslStatus === "connecting"}
              >
                <Radio className={lslStatus === "connected" ? "text-success" : ""} />
                <span className="flex-1 text-left">Verify LSL (OpenBCI GUI)</span>
              </Button>
              <ConnectionStatus status={lslStatus} />
            </div>

            {/* TCP Connection */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 justify-start gap-3"
                onClick={handleVerifyTCP}
                disabled={tcpStatus === "connecting"}
              >
                <Wifi className={tcpStatus === "connected" ? "text-success" : ""} />
                <span className="flex-1 text-left">Verify TCP (Unity)</span>
              </Button>
              <ConnectionStatus status={tcpStatus} />
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Actions
          </h3>
          
          <div className="grid gap-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start gap-3"
              onClick={handleGrazProtocol}
            >
              <Play className="h-5 w-5" />
              <span className="flex-1 text-left">Graz Protocol</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start gap-3"
              onClick={handleModelTraining}
            >
              <Brain className="h-5 w-5" />
              <span className="flex-1 text-left">Model Training</span>
            </Button>

            <Button
              variant={bothConnected ? "gradient" : "outline"}
              size="lg"
              className="w-full justify-start gap-3"
              onClick={handleOnlineScenario}
            >
              <Globe className="h-5 w-5" />
              <span className="flex-1 text-left">Online Scenario</span>
              {!bothConnected && (
                <span className="text-xs text-muted-foreground">(Requires connections)</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
