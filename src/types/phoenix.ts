/* ─────────────────────────────────────────────────────────────────────────────
   Agent trace span types (OpenTelemetry-style shape).

   Observed span_kind values: CHAIN, LLM, RETRIEVER, TOOL.
   In this standalone build these types describe the shape of the bundled
   demo fixture data — no live trace backend is contacted.
   ───────────────────────────────────────────────────────────────────────────── */

export interface PhoenixTrace {
  id: string;
  trace_id: string;
  project_id: string;
  start_time: string;
  end_time: string;
  token_count_prompt?: number;
  token_count_completion?: number;
  token_count_total?: number;
}

export interface PhoenixTraceListResponse {
  data: PhoenixTrace[];
  next_cursor?: string | null;
}

export interface PhoenixSpanEvent {
  name: string;
  timestamp: string;
  attributes?: Record<string, unknown>;
}

export interface PhoenixSpanContext {
  trace_id: string;
  span_id: string;
}

export interface PhoenixSpan {
  id?: string;
  name: string;
  span_kind: string;
  context: PhoenixSpanContext;
  parent_id?: string | null;
  start_time: string;
  end_time: string;
  status_code: string;
  status_message?: string;
  attributes?: Record<string, unknown>;
  events?: PhoenixSpanEvent[];
}

export interface PhoenixSpanListResponse {
  data: PhoenixSpan[];
  next_cursor?: string | null;
}
