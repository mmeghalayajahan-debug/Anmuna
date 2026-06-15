/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'expert' | 'user';
  registeredAt: string;
  avatar?: string;
  keyLimit?: number;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  username: string;
  toolId: string;
  toolName: string;
  target: string;
  severity: 'low' | 'medium' | 'high' | 'info';
  status: 'success' | 'failed' | 'warning';
  timestamp: string;
  details?: string;
}

export interface CyberTool {
  id: string;
  name: string;
  description: string;
  category: 'network' | 'security' | 'osint' | 'utility';
  active: boolean;
  requiresAuth: boolean;
  runs: number;
}
