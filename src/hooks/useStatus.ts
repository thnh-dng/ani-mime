import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import type { Status } from "../types/status";

const validStatuses = new Set<string>([
  "initializing",
  "searching",
  "busy",
  "idle",
  "service",
  "disconnected",
  "visiting",
]);

export function useStatus(): Status {
  const [status, setStatus] = useState<Status>("initializing");
  const [away, setAway] = useState(false);

  useEffect(() => {
    const unlistenStatus = listen<string>("status-changed", (e) => {
      if (validStatuses.has(e.payload)) {
        setStatus(e.payload as Status);
      }
    });

    const unlistenAway = listen<boolean>("dog-away", (e) => {
      setAway(e.payload);
    });

    return () => {
      unlistenStatus.then((fn) => fn());
      unlistenAway.then((fn) => fn());
    };
  }, []);

  return away ? "visiting" : status;
}
