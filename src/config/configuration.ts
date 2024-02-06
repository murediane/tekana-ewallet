export enum Environment {
  Production = 'Production',
  Development = 'Development',
  Test = 'Test',
}
export interface configuration {
  env: Environment;
  port: string;
  database: {
    user: string;
    password: string;
    db_connection: string;
    schema: string;
  };
  isDev(): boolean;
  isProd(): boolean;
  isTest(): boolean;
  jwt: {
    secret: string;
    expiresIn: string | number;
  };
  redis: {
    url: string;
  };
  kafka: {
    host: string;
  };
}

export default (): configuration => {
  const isProduction = process.env.NODE_ENV === Environment.Production;

  const isDevelopment = process.env.NODE_ENV === Environment.Development;

  const isTest = process.env.NODE_ENV === Environment.Test;

  return {
    env: process.env.NODE_ENV as Environment,
    port: process.env.PORT || '3000',
    database: {
      // host: process.env.DBHOST,
      // port: +process.env.DBPORT,
      user: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      db_connection: process.env.DB_CONNECTION_STRING,
      schema: isDevelopment
        ? process.env.SCHEMA
        : isTest
        ? process.env.TEST_SCHEMA
        : process.env.SCHEMA,
    },
    isDev(): boolean {
      return isDevelopment;
    },
    isProd(): boolean {
      return isProduction;
    },
    isTest(): boolean {
      return isTest;
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'default_jwt_secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    redis: {
      url: process.env.REDIS_URL,
    },
    kafka: {
      host: process.env.KAFKA_URL,
    },
  };
};
