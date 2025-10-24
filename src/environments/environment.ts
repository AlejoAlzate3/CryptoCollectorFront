import { baseEnvironment, BaseEnvironment } from './environment.base';

interface Environment extends BaseEnvironment {
    production: boolean;
    apiUrl: string;
}

export const environment: Environment = {
    ...baseEnvironment,
    production: false,
    apiUrl: 'http://localhost:8080'
};
