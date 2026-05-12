require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'demo-db',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: 8888,
        HOST: '0.0.0.0'
      }
    },
    {
      name: 'db',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: 6666,
        HOST: '0.0.0.0'
      }
    }
  ]
};
