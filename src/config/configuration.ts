export enum Environment {
  Production = 'production',
  Development = 'developement',
  Test = 'test',
}
export interface configuration {
  env: Environment;
  port: string;
  database: {
    url: string;
    test: string;
  };
  isDev(): boolean;
  isPRod(): boolean;
  isTest(): boolean;
  jwt: {
    secret: string;
    expiresIn: string | number;
  };
}
export default (): configuration => ({
  env: process.env.NODE_ENV as Environment,
  port: process.env.PORT,
  database: {
    url: process.env.DB_URL,
    test: process.env.TEST_DB_URL,
  },
  isDev(): boolean {
    return process.env.NODE_ENV === 'developement';
  },
  isPRod(): boolean {
    return process.env.NODE_ENV === 'production';
  },
  isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});
