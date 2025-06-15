import { app } from "./app";

async function start() {
  try {
    app.listen(3000, () => console.log('Server running on port 3000'));
  } catch (err) {
    console.error('Failed to start:', err);
  }
}

start();