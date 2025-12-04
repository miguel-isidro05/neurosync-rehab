import { cn } from "@/lib/utils";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

interface ConnectionStatusProps {
  status: ConnectionState;
  className?: string;
}

const statusConfig = {
  disconnected: {
    label: "Desconectado",
    color: "bg-muted-foreground",
    pulse: false,
  },
  connecting: {
    label: "Conectando...",
    color: "bg-warning",
    pulse: true,
  },
  connected: {
    label: "Conectado",
    color: "bg-success",
    pulse: false,
  },
  error: {
    label: "Error",
    color: "bg-destructive",
    pulse: false,
  },
};

export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-3 w-3">
        {config.pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping-slow",
              config.color
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-3 w-3 rounded-full",
            config.color
          )}
        />
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {config.label}
      </span>
    </div>
  );
}
