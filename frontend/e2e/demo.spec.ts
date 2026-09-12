import { expect, test, type Page } from '@playwright/test';

const API = process.env.E2E_API_URL || 'http://localhost:8000';
const OPERATOR = { 'X-Role': 'OPERATOR', 'X-User': 'e2e' };

/** Open the app directly on a domain as the Operator role, skipping the landing page. */
async function openApp(page: Page, domain: string) {
  await page.addInitScript(() => {
    localStorage.setItem('os.role', 'OPERATOR');
    localStorage.setItem('os.user', 'e2e');
    localStorage.removeItem('os.token');
  });
  await page.goto(`/?view=app#${domain}`);
  await expect(page.getByRole('button', { name: 'Surveillance', exact: true })).toBeVisible();
}

test.describe('demo path', () => {
  test('landing page launches into the command center', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Autonomous Maritime/ })).toBeVisible();
    await page.getByRole('button', { name: /Sentinel Radar Surveillance/ }).click();
    await expect(page.getByText('Watchlist')).toBeVisible();
  });

  test('surveillance: run the composite scenario, open the case, escalate it', async ({ page }) => {
    await openApp(page, 'surveillance');
    await page.getByRole('button', { name: 'Run scenario' }).click();
    await expect(page.getByText('FV Night Hauler').first()).toBeVisible();
    await expect(page.getByText('Feeds · 2')).toBeVisible();

    await page.getByText('FV Night Hauler').first().click();
    await expect(page.getByText('Evidence, strongest first')).toBeVisible();
    await expect(page.getByText(/Behavior departs from this vessel's baseline/)).toBeVisible();

    await page.getByRole('button', { name: /^Case \d+$/ }).click();
    await expect(page.getByText('Evidence', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Escalate' }).click();
    await expect(page.getByText('Escalated', { exact: true })).toBeVisible();
    await expect(page.getByText(/e2e \(operator\)/)).toBeVisible();
  });

  test('timeline and replay open from the vessel panel', async ({ page }) => {
    await openApp(page, 'surveillance');
    await page.getByText('FV Night Hauler').first().click();
    await page.getByRole('button', { name: 'Timeline' }).click();
    await expect(page.getByText(/detections ·/)).toBeVisible();
    await page.getByRole('button', { name: '← Vessel' }).click();
    await page.getByRole('button', { name: 'Replay' }).click();
    await expect(page.getByLabel('Exit replay')).toBeVisible();
  });

  test('roles: a viewer cannot run scenarios and sign-in restores the account role', async ({ page }) => {
    await openApp(page, 'surveillance');
    await page.getByRole('combobox').first().selectOption('VIEWER');
    await expect(page.getByRole('button', { name: 'Run scenario' })).toBeDisabled();
    await expect(page.getByText('Viewers can watch, not run')).toBeVisible();

    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByPlaceholder('operator').fill('operator');
    await page.locator('input[type="password"]').fill('operator');
    await page.getByRole('button', { name: 'Sign in' }).last().click();
    await expect(page.getByText(/operator · Sign out/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Run scenario' })).toBeEnabled();
    const me = await page.request.get(`${API}/api/v1/auth/me`, { headers: OPERATOR });
    expect((await me.json()).role).toBe('OPERATOR');
  });

  test('logistics: injecting the default hazard reroutes the live voyage', async ({ page }) => {
    await page.request.post(`${API}/api/v1/simulation/scenarios/reset-environment`, { headers: OPERATOR });
    await openApp(page, 'logistics');
    await expect(page.getByText('Route Operations')).toBeVisible();
    await page.getByRole('button', { name: 'Inject hazard' }).click();
    await expect(page.getByText('1 active storm')).toBeVisible();
    // The commander only reroutes a voyage whose active route crosses the storm. On a fresh database it does;
    // after an earlier reroute the active route already avoids it, and the honest outcome is "no route at risk".
    const cycle = await (await page.request.post(`${API}/api/v1/simulation/cycle`, { headers: OPERATOR })).json();
    const routing = cycle.environmental_routing;
    expect(routing.storms_detected).toBeGreaterThan(0);
    const versions = await (await page.request.get(`${API}/api/v1/routes/voyages/1/versions`)).json();
    expect(versions.filter((v: any) => v.status === 'active')).toHaveLength(1);
    if (routing.routes_recalculated > 0) {
      await page.getByRole('button', { name: /Lineage History/ }).click();
      await expect(page.getByText(/HAZARD AVOIDANCE/).first()).toBeVisible();
    } else {
      expect(routing.routes_at_risk).toBe(0);
    }
  });

  test('cleanup: a planned sortie is dispatched and its unit leaves port', async ({ page }) => {
    await openApp(page, 'cleanup');
    await page.getByText('Plan Autonomous Sortie').click();
    await page.getByText('Generate Optimized Plan').click();
    await expect(page.getByText('Authorize & Dispatch Fleet')).toBeVisible();
    await page.getByText('Authorize & Dispatch Fleet').click();
    await expect(page.getByText('Authorize & Dispatch Fleet')).toBeHidden();
    const units = await (await page.request.get(`${API}/api/v1/fleet/units`)).json();
    expect(units.some((u: any) => u.status === 'transit' && u.assigned_mission_id)).toBe(true);
  });
});
