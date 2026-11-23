import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
    ...nextVitals,
    ...nextTypescript,
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            'import/order': [
                'error',
                {
                    alphabetize: {
                        caseInsensitive: true,
                        order: 'asc',
                    },
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    pathGroups: [
                        {
                            group: 'internal',
                            pattern: '@/**',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin', 'external'],
                },
            ],
        },
    },
    globalIgnores(['.next/**', 'coverage/**', 'node_modules/**', 'out/**']),
]);
