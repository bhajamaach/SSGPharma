module.exports = {
  apps: [
    {
      name: "nextapp",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: process.env.APP_PORT || "5050",
      },
    },
  ],
};
