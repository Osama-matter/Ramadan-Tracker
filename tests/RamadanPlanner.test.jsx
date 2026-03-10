import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RamadanPlanner from '../src/components/RamadanPlanner';
import { STORAGE_SERVICE } from '../src/services/storageService';

describe('RamadanPlanner Component', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();

        // Mock the current date to force "Day 1" behaviour consistently
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date('2026-02-20T10:00:00.000Z')); // Day 1
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders the planner header and empty state by default', () => {
        render(<RamadanPlanner />);

        expect(screen.getByText('جدول الأثر اليومي')).toBeInTheDocument();
        expect(screen.getByText('١')).toBeInTheDocument(); // Active day (Arabic Numeral)

        // Empty state message
        expect(screen.getByText('جدول اليوم فارغ')).toBeInTheDocument();
    });

    it('allows adding a new custom task', async () => {
        render(<RamadanPlanner />);

        // Click the Add button (+ icon)
        const addButton = screen.getByText('+');
        fireEvent.click(addButton);

        // Type in the input
        const input = screen.getByPlaceholderText('اكتب هدفاً لهذا اليوم...');
        fireEvent.change(input, { target: { value: 'صلاة ركعتين شكر' } });

        // Select category and submit
        const submitBtn = screen.getByText('حفظ في جدول اليوم');
        fireEvent.click(submitBtn);

        // Verify task is added to DOM
        expect(await screen.findByText('صلاة ركعتين شكر')).toBeInTheDocument();
        expect(screen.queryByText('جدول اليوم فارغ')).not.toBeInTheDocument();

        // Verify it saved to localStorage
        const savedTasks = STORAGE_SERVICE.getItem('athr_planner_tasks_day_1');
        expect(savedTasks).toHaveLength(1);
        expect(savedTasks[0].text).toBe('صلاة ركعتين شكر');
        expect(savedTasks[0].completed).toBe(false);
    });

    it('allows toggling a task as completed', async () => {
        // Pre-populate storage
        STORAGE_SERVICE.setItem('athr_planner_tasks_day_1', [
            { id: 1, text: 'قراءة سورة الكهف', category: 'قرآن', completed: false }
        ]);

        render(<RamadanPlanner />);

        // Task should be loaded
        const taskText = await screen.findByText('قراءة سورة الكهف');
        expect(taskText).toBeInTheDocument();

        // Click the task wrapper to complete it
        const taskContainer = taskText.closest('.group').firstChild;
        fireEvent.click(taskContainer);

        // Verify it updated in localStorage
        await waitFor(() => {
            const savedTasks = STORAGE_SERVICE.getItem('athr_planner_tasks_day_1');
            expect(savedTasks[0].completed).toBe(true);
        });
    });

    it('allows deleting a task', async () => {
        STORAGE_SERVICE.setItem('athr_planner_tasks_day_1', [
            { id: 1, text: 'مهمة للحذف', category: 'عام', completed: false }
        ]);

        render(<RamadanPlanner />);

        // Delete button (represented by trash emoji 🗑️)
        const delBtn = await screen.findByText('🗑️', { exact: false });
        fireEvent.click(delBtn);

        // Verify it was removed from DOM
        await waitFor(() => {
            expect(screen.queryByText('مهمة للحذف')).not.toBeInTheDocument();
        });

        // Verify it was removed from localStorage
        const savedTasks = STORAGE_SERVICE.getItem('athr_planner_tasks_day_1');
        expect(savedTasks).toHaveLength(0);
    });
});
