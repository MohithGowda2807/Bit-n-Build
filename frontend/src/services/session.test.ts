import { beforeEach, describe, expect, it } from 'vitest';
import { session } from './session';

describe('session', () => {
  beforeEach(() => { session.signOut(); session.setRole('OPERATOR'); });

  it('sends the dev role headers when nobody is signed in', () => {
    expect(session.headers()).toEqual({ 'X-Role': 'OPERATOR', 'X-User': 'operator' });
    expect(session.signedIn).toBe(false);
  });

  it('sends a bearer token and the token role once signed in', () => {
    session.signIn({ access_token: 'tok', role: 'ANALYST', name: 'sam' });
    expect(session.headers().Authorization).toBe('Bearer tok');
    expect(session.role).toBe('ANALYST');
    expect(session.user).toBe('sam');
    expect(session.signedIn).toBe(true);
  });

  it('drops the token and keeps a plain role after sign-out', () => {
    session.signIn({ access_token: 'tok', role: 'ADMIN', name: 'root' });
    session.signOut();
    expect(session.headers().Authorization).toBeUndefined();
    expect(session.signedIn).toBe(false);
    expect(session.role).toBe('ADMIN');
  });
});
