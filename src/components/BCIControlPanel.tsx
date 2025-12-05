import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Wifi, Play, Square, Activity, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

export function BCIControlPanel() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("disconnected");
  const [isRunning, setIsRunning] = useState(false);
  const [currentSignal, setCurrentSignal] = useState<string | null>(null);
  const [signalTimestamp, setSignalTimestamp] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  const handleVerifyConnection = async () => {
    setConnectionStatus("connecting");
    
    try {
      // Call the FastAPI endpoint to verify TCP connection
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
        setConnectionStatus("connected");
        toast({
          title: "Connection established",
          description: `TCP connection verified. Client: ${data.client_address || "Unknown"}`,
        });
      } else {
        setConnectionStatus("error");
        toast({
          title: "Connection error",
          description: "No TCP client connected. Please start the test client or OpenVIBE connection.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus("error");
      toast({
        title: "Connection error",
        description: error instanceof Error 
          ? `Could not verify connection: ${error.message}` 
          : "Could not establish TCP connection. Make sure the server is running on http://localhost:8000",
        variant: "destructive",
      });
    }
  };

  // WebSocket connection for real-time signals
  useEffect(() => {
    if (isRunning) {
      // Connect to WebSocket when session starts
      console.log("🔌 Attempting to connect WebSocket to ws://localhost:8000/ws/signals");
      let ws: WebSocket;
      
      try {
        ws = new WebSocket("ws://localhost:8000/ws/signals");
        wsRef.current = ws;
      } catch (error) {
        console.error("❌ Failed to create WebSocket:", error);
        toast({
          title: "WebSocket connection failed",
          description: "Could not create WebSocket connection",
          variant: "destructive",
        });
        return;
      }

      ws.onopen = () => {
        console.log("✅ WebSocket connected for signal streaming");
        setWsConnected(true);
        toast({
          title: "WebSocket connected",
          description: "Ready to receive signals in real-time",
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", data);
          
          if (data.type === "signal") {
            setCurrentSignal(data.signal);
            setSignalTimestamp(data.timestamp);
            console.log("🎯 Signal received:", data.signal);
          } else if (data.type === "connection") {
            console.log("🔗 WebSocket connection confirmed");
          } else if (data.type === "keepalive") {
            console.log("💓 WebSocket keepalive");
          } else {
            console.log("📦 Other message type:", data.type);
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error, event.data);
        }
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setWsConnected(false);
        toast({
          title: "WebSocket error",
          description: "Failed to connect to signal stream. Check if server is running on http://localhost:8000",
          variant: "destructive",
        });
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected", event.code, event.reason);
        setWsConnected(false);
        if (event.code !== 1000) {
          // Not a normal closure
          toast({
            title: "WebSocket disconnected",
            description: `Connection closed unexpectedly (code: ${event.code})`,
            variant: "destructive",
          });
        }
      };

      // Cleanup on unmount or when session stops
      return () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } else {
      // Clear signal when session stops
      setCurrentSignal(null);
      setSignalTimestamp(null);
      setWsConnected(false);
      // Close WebSocket if open
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  }, [isRunning]);

  const handleToggleSession = async () => {
    // If stopping session, just stop it
    if (isRunning) {
      setIsRunning(false);
      setCurrentSignal(null);
      setSignalTimestamp(null);
      toast({
        title: "Session stopped",
        description: "The neurofeedback session has been stopped.",
      });
      return;
    }

    // If starting session, verify connection first
    try {
      // Verify TCP connection in real-time before starting
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
      
      if (!data.connected) {
        setConnectionStatus("error");
        toast({
          title: "Cannot start session",
          description: "TCP connection is not active. Please verify the connection first.",
          variant: "destructive",
        });
        return;
      }

      // Connection is active, update status and start session
      setConnectionStatus("connected");
      setIsRunning(true);
      
      toast({
        title: "Session started",
        description: "Starting EEG signal acquisition...",
      });
    } catch (error) {
      setConnectionStatus("error");
      toast({
        title: "Cannot start session",
        description: error instanceof Error 
          ? `Connection verification failed: ${error.message}` 
          : "Could not verify TCP connection. Make sure the server is running.",
        variant: "destructive",
      });
    }
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
            disabled={!isRunning && connectionStatus !== "connected"}
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

        {/* Session status and signal display */}
        {isRunning && (
          <div className="space-y-4">
            <div className="bg-accent/50 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-slow" />
                <span className="text-foreground font-medium">
                  Active session - Acquiring EEG signals
                </span>
              </div>
            </div>

            {/* Signal display */}
            {currentSignal && (
              <div className="bg-card rounded-xl p-6 border-2 border-primary shadow-lg">
                <div className="text-center space-y-3">
                  <div className="text-sm text-muted-foreground font-medium">
                    Motor Imagery Detected
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    {currentSignal === "izquierda" ? (
                      <>
                        <ArrowLeft className="h-12 w-12 text-primary animate-pulse" />
                        <div className="text-2xl font-bold text-primary">
                          IZQUIERDA
                        </div>
                      </>
                    ) : currentSignal === "derecha" ? (
                      <>
                        <div className="text-2xl font-bold text-primary">
                          DERECHA
                        </div>
                        <ArrowRight className="h-12 w-12 text-primary animate-pulse" />
                      </>
                    ) : (
                      <div className="text-xl font-semibold text-foreground">
                        {currentSignal.toUpperCase()}
                      </div>
                    )}
                  </div>
                  {signalTimestamp && (
                    <div className="text-xs text-muted-foreground">
                      {new Date(signalTimestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!currentSignal && (
              <div className="bg-muted/50 rounded-xl p-4 border border-border text-center">
                <div className="text-sm text-muted-foreground">
                  Waiting for motor imagery signal...
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Press 'i' or 'd' in the test client to send signals
                </div>
                <div className="text-xs mt-2">
                  WebSocket: {wsConnected ? (
                    <span className="text-success">Connected</span>
                  ) : (
                    <span className="text-destructive">Disconnected</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
