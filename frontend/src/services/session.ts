import { useEffect, useState } from 'react';
/** Who the operator is for this browser: a signed-in account's bearer token, or a dev role and audit name. */
import { ROLES, Role } from '../design/roles';

const ROLE_KEY = 'os.role';
const USER_KEY = 'os.user';
const TOKEN_KEY = 'os.token';
const DEFAULT_ROLE: Role = 'OPERATOR';
const DEFAULT_USER = 'operator';

export interface SignedIn {
  access_token: string;
  role: Role;
  name: string;
}

type Listener = (role: Role) => void;
const listeners = new Set<Listener>();

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* private mode: keep it in memory only */ }
}

function asRole(value: string | null): Role | null {
  return value && (ROLES as readonly string[]).includes(value) ? (value as Role) : null;
}

let role: Role = asRole(read(ROLE_KEY)) ?? DEFAULT_ROLE;
let user: string = read(USER_KEY) || DEFAULT_USER;
let token: string | null = read(TOKEN_KEY);

const notify = () => listeners.forEach(fn => fn(role));

export const session = {
  get role(): Role { return role; },
  get user(): string { return user; },
  get signedIn(): boolean { return token !== null; },
  /** Dev shortcut: pick a role without signing in. Ignored by the API once a token is present. */
  setRole(next: Role): void {
    role = next;
    write(ROLE_KEY, next);
    notify();
  },
  setUser(next: string): void {
    user = next.trim() || DEFAULT_USER;
    write(USER_KEY, user);
  },
  signIn(granted: SignedIn): void {
    token = granted.access_token;
    role = granted.role;
    user = granted.name;
    write(TOKEN_KEY, token);
    write(ROLE_KEY, role);
    write(USER_KEY, user);
    notify();
  },
  signOut(): void {
    token = null;
    write(TOKEN_KEY, null);
    notify();
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },
  /** A bearer token when signed in; the dev role headers travel too so a server with the header disabled still sees a clean request. */
  headers(): Record<string, string> {
    const base: Record<string, string> = { 'X-Role': role, 'X-User': user };
    return token ? { ...base, Authorization: `Bearer ${token}` } : base;
  },
};

/** The current role, re-rendering when the picker or a sign-in changes it. */
export function useRole(): Role {
  const [role, setRole] = useState<Role>(session.role);
  useEffect(() => session.subscribe(setRole), []);
  return role;
}
