export const sslparam = () =>
  +(process.env.DEV as string)
    ? {}
    : {
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      };
