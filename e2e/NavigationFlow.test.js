import { test, expect } from '@playwright/test';

test.describe('Ramadan Tracker User Flows', () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        await page.goto('/');

        // Set localStorage mock data if you want a specific initial state
        await page.evaluate(() => {
            window.localStorage.setItem('athr_dark_mode', 'false');
            // Bypass the onboarding screen (strings must be JSON stringified for STORAGE_SERVICE)
            window.localStorage.setItem('athr_user_name', '"مستخدم تجريبي"');
            // Acknowledge the settings tour to prevent unclickable overlays
            window.localStorage.setItem('athr_settings_tour_seen', 'true');
            // Acknowledge the Update Modal to prevent it from intercepting clicks
            window.localStorage.setItem('athr_last_version_seen', '"v2.0"');
        });

        // Reload so app picks up the injected state on boot
        await page.reload();
        
        // Wait for Splash screen (2.5s) + fade out (0.5s) + buffer
        await page.waitForTimeout(4000);
    });

    test('app boots successfully (no black screen) and renders', async ({ page }) => {
        // Verify title or main landmark
        await expect(page).toHaveTitle(/أثر/);

        // Ensure the main container rendered (no black screen React crash)
        const rootContent = page.locator('#root').first();
        await expect(rootContent).toBeVisible();
    });

    test('can navigate to Quran section and back', async ({ page }) => {
        // Navigate to 'More' tab first
        await page.click('[data-testid="nav-more"]');

        // Click the Quran feature button
        await page.click('button:has-text("قراءة القرآن")');

        // Verify Quran section header exists
        await expect(page.locator('text=المصحف الشريف')).toBeVisible();

        // Click Home nav button
        await page.click('[data-testid="nav-home"]');

        // Home should have the dashboard loaded
        await expect(page.locator('#root')).toBeVisible();
    });

    test('opening the Planner and interacting with daily tasks', async ({ page }) => {
        // Navigate to 'More' tab first
        await page.click('[data-testid="nav-more"]');

        // Click on Planner in FeatureGrid
        await page.click('text=تخطيط الشهر');

        // Wait for Planner component to mount
        await expect(page.locator('text=جدول الأثر اليومي')).toBeVisible();
    });

    test('Last 10 Days section loads correctly', async ({ page }) => {
        // Navigate to 'More' tab first
        await page.click('[data-testid="nav-more"]');
        
        // Click on Last 10 Days plan in FeatureGrid
        await page.click('text=خطة العشر الأواخر');

        // Wait for it to mount
        await expect(page.locator('text=خطة رمضان الكاملة')).toBeVisible();
        await expect(page.locator('text=إجمالي التقدم')).toBeVisible();
    });

});
