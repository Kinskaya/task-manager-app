import type { TTaskStatus } from '../../types';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskRow } from './TaskRow.tsx';
import { expect, fn, userEvent, within } from 'storybook/test';


const mockTaskOptions = [
  { value: 'new' as TTaskStatus, label: 'Новая' },
  { value: 'in_progress' as TTaskStatus, label: 'В работе' },
  { value: 'done' as TTaskStatus, label: 'Готово' },
];

const meta: Meta<typeof TaskRow> = {
  title: 'Components/Tasks/TaskRow',
  component: TaskRow,
  tags: ['autodocs'],
  args: {
    task: {
      id: 'task-test-1',
      listId: 'list-1',
      title: 'Проверить интеграционные тесты Storybook',
      description: 'Написать историю с функцией play для смены статуса',
      status: 'new',
      priority: 'high',
      deadline: '2026-10-25T00:00:00.000Z',
    },
    taskStatusOptions: mockTaskOptions,
    onStatusChange: fn(),
    onEdit: fn(),
    onDelete: fn(),
    onViewDetails: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TaskRow>;

export const ChangeStatusInteraction: Story = {
  name: 'Интерактив: Смена статуса задачи',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const statusSelect = canvas.getByRole('combobox');
    await expect(statusSelect).toBeInTheDocument();

    await expect(statusSelect).toHaveValue('new');

    await userEvent.selectOptions(statusSelect, 'in_progress');

    await expect(args.onStatusChange).toHaveBeenCalledWith('task-test-1', 'in_progress');
  },
};