/** Who the operator is for this browser: role and audit name, sent as headers on every surveillance call. */
import { ROLES, Role } from '../design/roles';

const ROLE_KEY = 'os.role';
const USER_KEY = 'os.user';
const DEFAULT_ROLE: Role = 'OPERATOR';
const DEFAULT_USER = 'operator';

type Listener = (role: Role) => void;
const listeners = new Set<Listener>();

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function write(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* private mode: keep it in memory only */ }
}

let role: Role = (ROLES as readonly string[]).includes(read(ROLE_KEY) ?? '') ? (read(ROLE_KEY) as Role) : DEFAULT_ROLE;
let user: string = read(USER_KEY) || DEFAULT_USER;

export const session = {
  get role(): Role { return role; },
  get user(): string { return user; },
  setRole(next: Role): void {
    role = next;
    write(ROLE_KEY, next);
    listeners.forEach(fn => fn(next));
  },
  setUser(next: string): void {
    user = next.trim() || DEFAULT_USER;
    write(USER_KEY, user);
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },
  headers(): Record<string, string> {
    return { 'X-Role': role, 'X-User': user };
  },
};
