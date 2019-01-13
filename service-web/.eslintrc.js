module.exports = {
    "extends": ["airbnb-base", "plugin:react/recommended"],
    //"parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "modules": true
        }
    },
    "plugins": [
        "react",
        'jest',
    ],
    "rules": {
        "semi": ["error", "never"],
        "no-console": [0, "allow"],
        "max-len": [1, 100, 2, {ignoreComments: true}],
    }
};