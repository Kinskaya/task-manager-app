import type { Task, TaskList } from '../types';
import { http, HttpResponse } from 'msw';
import type { LoginInput } from '../schema/authSchema.ts';
import { calculateCompletionProgress } from '../lib/counters.ts';

export let mockLists: TaskList[] = [
  {
    id: 'list-1',
    title: 'Работа и проекты',
  },
  {
    id: 'list-2',
    title: 'Личные дела',
  },
] as TaskList[];

let mockTasks: Task[] = [
  {
    id: 'task-1',
    listId: 'list-1',
    title: 'Подготовить отчет по ТЗ',
    description: 'Написать юнит-тесты на сортировку задач',
    status: 'done',
    priority: 'high',
    deadline: '2026-10-20T12:00:00.000Z',
  },
  {
    id: 'task-2',
    listId: 'list-1',
    title: 'Сверстать LoginForm на Tailwind',
    description: 'Связать лейблы и инпуты для доступности',
    status: 'in_progress',
    priority: 'medium',
    deadline: '2026-10-25T12:00:00.000Z',
  },
  {
    id: 'task-3',
    listId: 'list-1',
    title: 'Исправить баги с кэшем Storybook',
    description: 'Перейти на правильные типы из react-vite пакета',
    status: 'new',
    priority: 'low',
    deadline: '2026-10-01T12:00:00.000Z',
  },
  {
    id: 'task-4',
    listId: 'list-2',
    title: 'Купить продукты',
    description: 'Молоко, хлеб, фрукты',
    status: 'new',
    priority: 'medium',
    deadline: '2026-10-17T12:00:00.000Z',
  },
];

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginInput;
    if (body.email === 'admin@example.com' && body.password === 'Admin123!') {
      return HttpResponse.json({ success: true, user: { name: 'Анастасия', role: 'admin' } });
    }
    return new HttpResponse(
      JSON.stringify({ message: 'Неверный логин или пароль' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  http.get('/api/lists', () => {
    const listsWithProgress = calculateCompletionProgress(mockLists, mockTasks)
    return HttpResponse.json(listsWithProgress);
  }),

  http.get('/api/lists/:listId/tasks', ({ params }) => {
    const { listId } = params;
    const filteredTasks = mockTasks.filter((task) => task.listId === listId);
    return HttpResponse.json(filteredTasks);
  }),

  http.post('/api/tasks', async ({ request }) => {
    const body = (await request.json()) as Task;

    const newTask: Task = {
      id: `task-${crypto.randomUUID()}`,
      listId: body.listId,
      title: body.title,
      description: body.description || '',
      status: body.status || 'new',
      priority: body.priority || 'low',
      deadline: body.deadline,
    };

    mockTasks = [...mockTasks, newTask];

    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.patch('/api/tasks/:taskId', async ({ params, request }) => {
    const { taskId } = params;
    const body = (await request.json()) as Task;

    let updatedTask: Task | undefined;

    mockTasks = mockTasks.map((task) => {
      if (task.id === taskId) {
        updatedTask = { ...task, status: body.status };
        return updatedTask;
      }
      return task;
    });

    if (updatedTask) {
      return HttpResponse.json(updatedTask);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/lists', async ({ request }) => {
    const body = (await request.json()) as { title: string };

    const newList = {
      id: `list-${crypto.randomUUID()}`,
      title: body.title,
    };
    mockLists = [...mockLists, newList as TaskList];

    return HttpResponse.json(newList, { status: 201 });
  }),

  http.delete('/api/lists/:id', ({ params }) => {
    const { id } = params;
    mockLists = mockLists.filter((list) => list.id !== id);

    return HttpResponse.json({ success: true });
  }),

  http.put('/api/lists/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { title: string };

    mockLists = mockLists.map((list) =>
      list.id === id ? { ...list, title: body.title } : list
    );
    const updatedList = mockLists.find((list) => list.id === id);

    if (updatedList) {
      return HttpResponse.json(updatedList);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.put('/api/tasks/:taskId', async ({ params, request }) => {
    const { taskId } = params;
    const body = (await request.json()) as Task;

    mockTasks = mockTasks.map((task) =>
      task.id === taskId
        ? {
          ...task,
          title: body.title,
          description: body.description,
          status: body.status,
          priority: body.priority,
          deadline: body.deadline
        }
        : task
    );

    const updatedTask = mockTasks.find((task) => task.id === taskId);

    if (updatedTask) {
      return HttpResponse.json(updatedTask);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.delete('/api/tasks/:taskId', async ({ params }) => {
    const { taskId } = params;
    mockTasks = mockTasks.filter((task) => task.id !== taskId);

    return new HttpResponse(null, { status: 200 });
  }),
];