
export type ComponentType = 'text' | 'chart' | 'tracker' | 'palette' | 'system-alert';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: ComponentType;
  data?: any;
}

export interface AgentStep {
  id: string;
  label: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  icon: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'done';
  logs: string[];
}

export type GlobalTheme = 'obsidian' | 'trust-blue' | 'cyberpunk-neon' | 'glass-white';
