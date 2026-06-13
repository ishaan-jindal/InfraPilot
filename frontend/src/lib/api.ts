import type {
  Repository,
  Branch,
  DeployRequest,
  DeployResponse,
  Deployment,
  DeploymentListResponse,
  DeploymentLogsResponse,
  DeploymentStatusResponse,
  SecurityAdvisorResponse,
  DeleteDeploymentResponse,
} from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/* ── Helpers ────────────────────────────────────────────────────────── */

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(body.detail ?? res.statusText, res.status);
  }
  return res.json() as Promise<T>;
}

function qs(params: Record<string, string | number | undefined | null>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null
  );
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

/* ── Auth ────────────────────────────────────────────────────────────── */

export function getOAuthUrl(): string {
  return `${API}/auth/github`;
}

export async function exchangeCode(code: string): Promise<string> {
  const data = await request<{ access_token: string }>(
    `/auth/callback${qs({ code })}`
  );
  return data.access_token;
}

/* ── Repositories ───────────────────────────────────────────────────── */

export async function getRepositories(
  token: string,
  page = 1,
  perPage = 30
): Promise<Repository[]> {
  return request<Repository[]>(
    `/repositories${qs({ token, page, per_page: perPage })}`
  );
}

export async function getRepository(
  owner: string,
  repo: string,
  token: string
): Promise<Repository> {
  return request<Repository>(
    `/repositories/${owner}/${repo}${qs({ token })}`
  );
}

export async function getBranches(
  owner: string,
  repo: string,
  token: string
): Promise<Branch[]> {
  return request<Branch[]>(
    `/repositories/${owner}/${repo}/branches${qs({ token })}`
  );
}

/* ── Deployments ────────────────────────────────────────────────────── */

export async function startDeploy(body: DeployRequest): Promise<DeployResponse> {
  return request<DeployResponse>("/deploy", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getDeployments(
  skip = 0,
  limit = 20
): Promise<DeploymentListResponse> {
  return request<DeploymentListResponse>(
    `/deployments${qs({ skip, limit })}`
  );
}

export async function getDeployment(id: string): Promise<Deployment> {
  return request<Deployment>(`/deploy/${id}`);
}

export async function getDeploymentLogs(
  id: string
): Promise<DeploymentLogsResponse> {
  return request<DeploymentLogsResponse>(`/deploy/${id}/logs`);
}

export async function getDeploymentStatus(
  id: string
): Promise<DeploymentStatusResponse> {
  return request<DeploymentStatusResponse>(`/deploy/${id}/status`);
}

export async function redeployDeployment(id: string): Promise<DeployResponse> {
  return request<DeployResponse>(`/deploy/${id}/redeploy`, { method: "POST" });
}

export async function deleteDeployment(
  id: string
): Promise<DeleteDeploymentResponse> {
  return request<DeleteDeploymentResponse>(`/deploy/${id}`, {
    method: "DELETE",
  });
}

/* ── Security ───────────────────────────────────────────────────────── */

export async function getSecurityAdvisor(
  id: string
): Promise<SecurityAdvisorResponse> {
  return request<SecurityAdvisorResponse>(`/deploy/${id}/security-advisor`);
}

export async function approveDeployment(id: string): Promise<DeployResponse> {
  return request<DeployResponse>(`/deploy/${id}/approve`, { method: "POST" });
}

/* ── WebSocket ──────────────────────────────────────────────────────── */

export function createLogSocket(deploymentId: string): WebSocket {
  const wsBase = API.replace(/^http/, "ws");
  return new WebSocket(`${wsBase}/ws/logs/${deploymentId}`);
}
