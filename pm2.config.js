{
  apps: [
    {
      name: 'ntr-server',
      script: './dist/main.js',
      watch: true,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ];
}
