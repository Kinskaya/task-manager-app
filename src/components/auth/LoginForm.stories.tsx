import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoginForm } from './LoginForm.tsx';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta: Meta<typeof LoginForm> = {
  title: 'Components/Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  args: { onSubmit: fn() },
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const WithServerError: Story = {
  args: {
    error: 'Неверный логин или пароль. Попробуйте еще раз.',
  },
};

export const SuccessfulSubmit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/Email/i), 'admin@example.com', {
      delay: 50,
    });

    await userEvent.type(canvas.getByLabelText(/Пароль/i), 'Admin123!', {
      delay: 50,
    });

    await userEvent.click(canvas.getByRole('button', { name: /Войти/i }));

    const emailError = canvas.queryByText(/Некорректный формат email/i);
    const passwordError = canvas.queryByText(/Пароль должен быть не менее/i);

    expect(emailError).toBeNull();
    expect(passwordError).toBeNull();
  },
};

export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/Email/i), 'invalid-email', {
      delay: 50,
    });

    await userEvent.type(canvas.getByLabelText(/Пароль/i), '123', {
      delay: 50,
    });

    await userEvent.click(canvas.getByRole('button', { name: /Войти/i }));

    await expect(canvas.getByText(/Некорректный формат email/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Пароль должен быть не менее 6 символов/i)).toBeInTheDocument();
  },
};