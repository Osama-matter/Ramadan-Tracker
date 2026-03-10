import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});

// Mock jsdom limitations
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock Capacitor globals so components don't crash
global.window.Capacitor = {
    getPlatform: () => 'web',
    Plugins: {
        LocalNotifications: {
            checkPermissions: vi.fn(),
            requestPermissions: vi.fn(),
            schedule: vi.fn(),
            cancel: vi.fn(),
        },
        AndroidForegroundService: {
            startForegroundService: vi.fn(),
            stopForegroundService: vi.fn(),
        },
        App: {
            addListener: vi.fn(),
        }
    }
};
