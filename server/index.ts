import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
  console.log(`EduPro API is running at http://localhost:${env.port}/api/v1`);
  console.log('Demo admin: admin@edupro.local / Admin@123');
});
