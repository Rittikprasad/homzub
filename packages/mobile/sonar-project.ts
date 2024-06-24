// @ts-ignore
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'SERVER_URL',
    token: 'SERVER_TOKEN',
  },
  () => {}
);
