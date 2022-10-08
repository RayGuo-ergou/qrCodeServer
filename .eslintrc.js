module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },

    extends: ['prettier', 'eslint:recommended'],
    plugins: ['prettier'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                trailingComma: 'es5',
                tabWidth: 4,
                semi: true,
                singleQuote: true,
            },
        ],
    },
};
