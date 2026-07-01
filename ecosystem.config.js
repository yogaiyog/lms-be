module.exports = {
  apps: [{
    name: 'lms-backend',
    script: 'dist/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
