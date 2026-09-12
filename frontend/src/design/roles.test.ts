import { describe, expect, it } from 'vitest';
import { ROLES, atLeast, can } from './roles';

describe('roles', () => {
  it('orders the ladder viewer to admin', () => {
    expect(ROLES).toEqual(['VIEWER', 'ANALYST', 'OPERATOR', 'ADMIN']);
    expect(atLeast('OPERATOR', 'ANALYST')).toBe(true);
    expect(atLeast('ANALYST', 'OPERATOR')).toBe(false);
  });

  it('maps actions to the minimum role', () => {
    expect(can('VIEWER', 'view_cases')).toBe(false);
    expect(can('ANALYST', 'view_cases')).toBe(true);
    expect(can('ANALYST', 'act_on_cases')).toBe(false);
    expect(can('OPERATOR', 'act_on_cases')).toBe(true);
    expect(can('OPERATOR', 'run_scenarios')).toBe(true);
    expect(can('OPERATOR', 'manage_system')).toBe(false);
    expect(can('ADMIN', 'manage_system')).toBe(true);
  });
});
