module.exports = {
    "ignorePatterns": ["coverage*"],
    "env": {
        "browser": true,
        "commonjs": true,
        "node":true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "globals": {
        "describe": "readonly",
        "it": "readonly",
        "artifacts": "readonly",
        "web3": "readonly",
        "before": "readonly",
        "beforeEach": "readonly",
        "contract": "readonly",
        "afterEach": "readonly"
    },
    "rules": {
        "no-unused-vars":"off"
    }
};