const path = require('path')

module.exports = {
    "env": {
      "browser": true
    },
    "extends": "airbnb",
    "globals": {
      "__DEV__": true,
      "initMoatTracking": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
      "allowImportExportEverywhere": true,
      "ecmaFeatures": {
          "jsx": true,
          "modules": true
      }
    },
    "plugins": [
        "react",
        "import"
    ],
    "rules": {
      "no-console": [
        "error",
        {
          "allow": ["warn", "error", "info"]
        }
      ],
      "no-unused-vars": "error",
      "comma-dangle": ["error", "never"],
      "arrow-parens": "off",
      "import/no-named-as-default": 0,
      "generator-star-spacing": "off",
      "import/extensions": "off",
      "react/forbid-prop-types": "off",
      "react/jsx-filename-extension": "off",
      "react/no-danger": "off",
      "react/no-unused-prop-types": "off",
      "react/prop-types": "off",
      "indent": ["error", 2],
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "max-len": ["error", { "code": 150, "tabWidth": 2 }],
      "no-underscore-dangle": 0,
      "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
      "no-unused-expressions": ["error", { "allowShortCircuit": true }],
      "class-methods-use-this": "warn",
      "no-param-reassign": "warn",
      "camelcase": "warn",
      "prefer-destructuring": "warn",
      "prefer-const": "warn",
      "jsx-a11y/media-has-caption": "off",
      "import/no-extraneous-dependencies": ["error", {"packageDir": path.join(__dirname, './')}],
      "react/sort-comp": [1, {
        order: [
          'type-annotations',
          'static-methods',
          'lifecycle',
          'everything-else',
          'render',
        ],
      }],
      "space-before-function-paren": ["error", "always"],
      "no-restricted-syntax": [
        "off",
        "ForOfStatement",
      ]
    }
};
