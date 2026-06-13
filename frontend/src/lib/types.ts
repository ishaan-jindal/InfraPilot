/* ── Enums (match backend models.py exactly) ────────────────────────── */

export type DeploymentStatus =
  | "pending"
  | "cloning"
  | "detecting"
  | "scanning"
  | "awaiting_approval"
  | "building"
  | "starting"
  | "configuring_proxy"
  | "running"
  | "failed"
  | "stopped";

export type DeploymentTarget = "managed";

/* ── Pipeline ordering (for progress visualization) ─────────────────── */

export const PIPELINE_STEPS: DeploymentStatus[] = [
  "pending",
  "cloning",
  "detecting",
  "scanning",
  "building",
  "starting",
  "configuring_proxy",
  "running",
];

/* ── Deployment (matches deploy.py _to_out()) ───────────────────────── */

export interface Deployment {
  id: string;
  project_name: string;
  repo_url: string;
  branch: string | null;
  commit_hash: string | null;
  framework: string | null;
  build_command: string | null;
  start_command: string | null;
  port: number | null;
  status: DeploymentStatus;
  target: DeploymentTarget;
  host_port: number | null;
  subdomain: string | null;
  url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/* ── Deploy request / response ──────────────────────────────────────── */

export interface DeployRequest {
  repo_url: string;
  token?: string | null;
  project_name: string;
  branch?: string;
}

export interface DeployResponse {
  deployment_id: string;
  project_name: string;
  status: string;
  message: string;
}

export interface DeploymentListResponse {
  total: number;
  deployments: Deployment[];
}

/* ── GitHub types ────────────────────────────────────────────────────── */

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  clone_url: string;
  description: string | null;
  language: string | null;
  private: boolean;
  default_branch: string;
  updated_at: string;
}

export interface Branch {
  name: string;
  commit_sha: string;
}

/* ── Security types ─────────────────────────────────────────────────── */

export type SecuritySeverity = "CRITICAL" | "HIGH" | "MEDIUM";

export type SecurityFindingType =
  | "LEAKED_SECRET"
  | "RUNS_AS_ROOT"
  | "UNNECESSARY_PORT_EXPOSED";

export interface SecurityFinding {
  severity: SecuritySeverity;
  type: SecurityFindingType;
  file: string;
  message: string;
}

export interface SecurityAdvisorResponse {
  deployment_id: string;
  status: string;
  report: SecurityFinding[];
  advice: string;
}

/* ── WebSocket message types ────────────────────────────────────────── */

export interface WsHistoryMessage {
  type: "history";
  lines: string[];
}

export interface WsLogMessage {
  type: "log";
  line: string;
}

export type WsMessage = WsHistoryMessage | WsLogMessage;

/* ── Misc responses ─────────────────────────────────────────────────── */

export interface DeploymentLogsResponse {
  deployment_id: string;
  status: string;
  logs: string;
}

export interface DeploymentStatusResponse {
  deployment_id: string;
  deployment_status?: string;
  container_status: string;
}

export interface DeleteDeploymentResponse {
  detail: string;
  deployment_id: string;
}
