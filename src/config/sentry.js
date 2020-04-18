export default {
  dsn: process.env.SENTRY_DSN,
  beforeSend: (event) => {
    if (process.env.DEBUG) {
      console.error(event);
      return null;
    }
    return event;
  },
};
