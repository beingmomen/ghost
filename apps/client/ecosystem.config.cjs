require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'beingmomen',
      port: process.env.PORT,
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
