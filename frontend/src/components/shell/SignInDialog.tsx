import React, { useState } from 'react';
import { login } from '../../services/surveillance';
import { session } from '../../services/session';
import { Role } from '../../design/roles';
import { Eyebrow, Mono, OutlinePill, Panel, PrimaryPill } from '../ui/primitives';

interface Props {
  onClose: () => void;
  onSignedIn: (role: Role) => void;
}

/** Exchanges a configured account for a bearer token; the role then comes from the token, not the picker. */
export const SignInDialog: React.FC<Props> = ({ onClose, onSignedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const granted = await login(username.trim(), password);
      session.signIn({ access_token: granted.access_token, role: granted.role, name: granted.name });
      onSignedIn(granted.role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  const field = 'os-mono bg-os-raised text-white text-sm border border-os-pewter rounded-input px-3 py-2 focus:outline-none focus:border-os-silver placeholder:text-os-slate';

  return (
    <div className="fixed inset-0 z-[2000] bg-os-void/80 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-medium text-white">Sign in</span>
            <span className="text-xs text-os-ash">Your role comes from the account. Demo accounts: admin, operator, analyst, viewer, each with the name as password.</span>
          </div>
          <label className="flex flex-col gap-1.5">
            <Eyebrow>Account</Eyebrow>
            <input className={field} value={username} onChange={e => setUsername(e.target.value)} autoFocus autoComplete="username" placeholder="operator" />
          </label>
          <label className="flex flex-col gap-1.5">
            <Eyebrow>Password</Eyebrow>
            <input className={field} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <Mono className="text-xs text-risk-critical">{error}</Mono>}
          <div className="flex items-center justify-end gap-2">
            <OutlinePill type="button" onClick={onClose}>Cancel</OutlinePill>
            <PrimaryPill type="submit" disabled={busy || !username || !password}>{busy ? 'Signing in…' : 'Sign in'}</PrimaryPill>
          </div>
        </form>
      </Panel>
    </div>
  );
};
