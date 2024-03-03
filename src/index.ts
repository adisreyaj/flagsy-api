import { App } from './app';

const start = async () => {
  try {
    const app = new App();
    await app.start();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

start().then(() => console.log('App running 🚀'));
