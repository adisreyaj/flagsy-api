import { initApp, startApp } from './app';
import { registerRoutes } from './routes/routes';

const start = async () => {
  try {
    const app = await initApp();
    registerRoutes(app);
    await startApp(app);
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

start().then(() => console.log('App running 🚀'));
