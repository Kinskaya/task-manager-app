/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(dirname, './src'),
        },
    },
    test: {
        // Разделяем тесты на два независимых потока (Массив проектов)
        projects: [
            // Проект 1: Обычные юнит-тесты на чистом JS/TS (наша сортировка и счетчики)
            {
                test: {
                    name: 'unit',
                    globals: true,
                    environment: 'jsdom',
                    // Запускаем юнит-тесты везде, кроме файлов историй .stories
                    exclude: ['**/*.stories.*', '**/*.spec.*', 'node_modules/**/*'],
                },
            },
            // Проект 2: Автоматически сгенерированный Storybook для запуска play-тестов
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, '.storybook')
                    })
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [{
                            browser: 'chromium'
                        }]
                    }
                }
            }
        ]
    }
});