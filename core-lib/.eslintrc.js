module.exports = {
  extends: "react-app",
  rules: {
    "no-throw-literal": 0,
    "max-len": [
      "warn",
      {
        code: 80,
        comments: 80, 
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
        ignoreUrls: true
      },
    ],
  },
};
