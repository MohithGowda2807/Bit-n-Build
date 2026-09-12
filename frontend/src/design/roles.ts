/** Role ladder and what each level unlocks; mirrors backend/app/security.py. */

export const ROLES = ['VIEWER', 'ANALYST', 'OPERATOR', 'ADMIN'] as const;
export type Role = typeof ROLES[number];

export type Action = 'view_map' | 'view_cases' | 'ask_analyst' | 'act_on_cases' | 'run_scenarios' | 'manage_system';

const MINIMUM: Record<Action, Role> = {
  view_map: 'VIEWER',
  view_cases: 'ANALYST',
  ask_analyst: 'ANALYST',
  act_on_cases: 'OPERATOR',
  run_scenarios: 'OPERATOR',
  manage_system: 'ADMIN',
};

export const ROLE_LABEL: Record<Role, string> = {
  VIEWER: 'Viewer', ANALYST: 'Analyst', OPERATOR: 'Operator', ADMIN: 'Admin',
};

export function atLeast(role: Role, minimum: Role): boolean {
  return ROLES.indexOf(role) >= ROLES.indexOf(minimum);
}

export function can(role: Role, action: Action): boolean {
  return atLeast(role, MINIMUM[action]);
}

export function requiredRole(action: Action): Role {
  return MINIMUM[action];
}
