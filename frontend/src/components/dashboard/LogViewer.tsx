"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createLogSocket, getDeploymentLogs } from "@/lib/api";
import type { WsMessage } from "@/lib/types";
import { Terminal } from "lucide-react";

interface LogViewerProps {
  deploymentId: string;
  /** If true, connects WebSocket for live streaming */
  live?: boolean;
  /** Pre-fetched logs (fallback when WS isn't needed) */
  initialLogs?: string;
}

export default function LogViewer({
  deploymentId,
  live = true,
  initialLogs,
}: LogViewerProps) {
  const [lines, setLines] = useState<string[]>(
    initialLogs ? initialLogs.split("\n") : []
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  /* auto-scroll logic */
  const scrollToBottom = useCallback(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  /* detect manual scroll-up to pause auto-scroll */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
      setAutoScroll(atBottom);
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  /* Log fetching & WebSocket connection */
  useEffect(() => {
    if (!live) {
      // Static mode: fetch full logs from API
      getDeploymentLogs(deploymentId)
        .then((res) => {
          setLines(res.logs ? res.logs.trim().split("\n") : ["— No logs available —"]);
        })
        .catch(() => {
          setLines(["— Failed to load logs —"]);
        });
      return;
    }

    // Live mode: connect WebSocket
    const ws = createLogSocket(deploymentId);

    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data);
        if (msg.type === "history") {
          setLines((prev) => [...prev, ...msg.lines]);
        } else if (msg.type === "log") {
          setLines((prev) => [...prev, msg.line]);
        }
      } catch {
        // Non-JSON message — treat as raw log line
        setLines((prev) => [...prev, event.data]);
      }
    };

    ws.onerror = () => {
      setLines((prev) => [...prev, "⚠ WebSocket connection error"]);
    };

    ws.onclose = () => {
      setLines((prev) => [...prev, "— Connection closed —"]);
    };

    return () => {
      ws.close();
    };
  }, [deploymentId, live]);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[#0d1117] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800 bg-[#161b22]">
        <Terminal className="w-4 h-4 text-zinc-500" />
        <span className="text-xs font-mono text-zinc-400">Build Logs</span>
        {live && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Live
          </span>
        )}
      </div>

      {/* Log output */}
      <div
        ref={containerRef}
        className="p-4 max-h-[500px] overflow-y-auto font-mono text-[13px] leading-5 text-zinc-300 scrollbar-thin"
      >
        {lines.length === 0 ? (
          <p className="text-zinc-600 italic">Waiting for logs…</p>
        ) : (
          lines.map((line, i) => (
            <div key={i} className="flex gap-3 hover:bg-zinc-800/40 px-1 -mx-1 rounded">
              <span className="text-zinc-600 select-none tabular-nums w-8 text-right shrink-0">
                {i + 1}
              </span>
              <span className="whitespace-pre-wrap break-all">{line}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Scroll-to-bottom indicator */}
      {!autoScroll && (
        <button
          onClick={() => {
            setAutoScroll(true);
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full py-1.5 text-xs text-center text-zinc-500 hover:text-zinc-300 bg-[#161b22] border-t border-zinc-800 transition-colors"
        >
          ↓ Scroll to bottom
        </button>
      )}
    </div>
  );
}
