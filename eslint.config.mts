import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default [
    // 1. Configuração global de ignores (DEVE estar no nível raiz)
    {
        ignores: [
            'gen/',
            '@cds-models/',
            'dist/',
            'node_modules/',
            '**/*.js',
            '!eslint.config.js',
            '!*.config.js'
        ]
    },
    
    // 2. Configurações de linguagem globais
    {
        languageOptions: {
            globals: globals.node
        }
    },
    
    // 3. Configurações recomendadas
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    
    // 4. Configuração específica para SEU CÓDIGO em srv/
    {
        files: ['srv/**/*.ts'],
        plugins: {
            prettier
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    tabWidth: 4,
                    trailingComma: 'none',
                    bracketSpacing: true,
                    printWidth: 120
                }
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^ignore',
                    ignoreRestSiblings: true
                }
            ],
            'eol-last': 'error',
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1
                }
            ],
            'max-len': ['error', 120],
            'max-lines-per-function': ['error', 30],
            'object-curly-spacing': ['error', 'always'],
            quotes: ['error', 'single'],
            'quote-props': ['error', 'as-needed'],
            semi: ['error', 'always'],
            'sort-imports': [
                'error',
                {
                    memberSyntaxSortOrder: ['single', 'all', 'multiple', 'none'],
                    allowSeparatedGroups: true
                }
            ]
        }
    }
];