export enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test',
}
export interface configuration {
  env: Environment;
  port: string;
  database: {
    url: string;
  };
  isDev(): boolean;
  isProd(): boolean;
  isTest(): boolean;
  jwt: {
    secret: string;
    expiresIn: string | number;
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
      url: isDevelopment
        ? process.env.DB_URL
        : isTest
        ? process.env.TEST_DB_URL
        : process.env.DB_URL,
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
  };
};
