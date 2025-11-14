module.exports = {
  apps: [
    {
      name: 'movie',
      cwd: './',
      script: './.output/server/index.mjs',
      args: ' start',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '256M',
      max_restarts: 5,
      autorestart: true,
    },
  ],
}
