module.exports = {
    env: {
      browser: true,
      node: true,
      es6: true,
      commonjs: true
    },
    parser: 'babel-eslint',
    parserOptions: {
      ecmaVersion: 6,
      ecmaFeatures: {
        jsx: true,
        experimentalObjectRestSpread: true,
      },
      sourceType: "module"
    },
    globals: {
      layui: "readonly",
      twaver: "readonly",
      _twaver: "readonly",
      echarts: "readonly"
  },
    plugins: ['babel', 'filenames'],
    rules: {
      'class-methods-use-this': 0,
      'linebreak-style': [0,"error", "windows"],
      'curly': ['error', 'all'],
      'dot-notation': 'error',
      'filenames/match-exported': 2,
      'id-length': [1, { min: 1, max: 35 }],
      'import/extensions': 0,
      'import/no-extraneous-dependencies': 0,
      'max-len': [
        'error',
        80,
        2,
        {
          ignoreUrls: true,
          ignoreComments: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
  
      "no-unused-vars": [2, {"vars": "all", "args": "after-used"}],
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
      'no-eval': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-this': 0,
      'babel/no-invalid-this': 0,
      'no-with': 'error',
      'no-undef': 'error',
      'no-var': 2,
      'jsx-a11y/no-static-element-interactions': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'prefer-rest-params': 'error',
      'keyword-spacing': 'error',
      'space-before-blocks': 'error',
    },
  };