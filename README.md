# todo_Ang


# setup.ps1
param(
  [string]$ProjectName = "enterprise-express"
)

Write-Host "🚀 Creating enterprise project: $ProjectName"

# 1) Create project root and move into it
New-Item -ItemType Directory -Force -Path $ProjectName | Out-Null
Set-Location $ProjectName

# 2) Init npm
npm init -y | Out-Null

# 3) Install runtime deps
npm install express apollo-server-express graphql reflect-metadata inversify tsyringe pino strong-soap axios joi zod kafkajs amqplib

# 4) Install dev deps (TS, lint, tests, arch checks, hooks)
npm install -D typescript ts-node-dev @types/node @types/express
npm install -D eslint eslint-config-prettier eslint-plugin-import @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D dependency-cruiser
npm install -D jest ts-jest @types/jest
npm install -D husky lint-staged

# 5) tsconfig.json with path aliases
@"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@features/*": ["features/*"],
      "@shared/*": ["shared/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
"@ | Set-Content tsconfig.json -Encoding UTF8

# 6) ESLint config (basic + import ordering)
@"
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: { project: './tsconfig.json' },
      node: { extensions: ['.ts', '.tsx', '.js', '.json'] }
    }
  },
  rules: {
    'import/order': ['error', {
      'groups': ['builtin','external','internal','parent','sibling','index','object','type'],
      'newlines-between': 'always',
      'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
      'pathGroups': [
        { 'pattern': '@app/**', 'group': 'internal', 'position': 'after' },
        { 'pattern': '@features/**', 'group': 'internal', 'position': 'after' },
        { 'pattern': '@shared/**', 'group': 'internal', 'position': 'after' }
      ],
      'pathGroupsExcludedImportTypes': ['builtin']
    }]
  },
  ignorePatterns: ['dist/', 'node_modules/']
};
"@ | Set-Content .eslintrc.js -Encoding UTF8

# 7) Dependency Cruiser (architecture guardrails)
@"
module.exports = {
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
    includeOnly: 'src'
  },
  forbidden: [
    // shared must not import features or app
    {
      name: 'no-shared-up',
      from: { path: '^src/shared' },
      to: { path: '^src/(features|app)' },
      severity: 'error'
    },
    // features must not import app
    {
      name: 'no-features-to-app',
      from: { path: '^src/features' },
      to: { path: '^src/app' },
      severity: 'error'
    }
  ]
};
"@ | Set-Content dependency-cruiser.config.js -Encoding UTF8

# 8) Jest config + a passing sample test
@"
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1'
  }
};
"@ | Set-Content jest.config.js -Encoding UTF8

New-Item -ItemType Directory -Force -Path tests | Out-Null
@"
describe('smoke', () => {
  it('passes', () => {
    expect(true).toBe(true);
  });
});
"@ | Set-Content tests/smoke.test.ts -Encoding UTF8

# 9) package.json scripts + lint-staged
npm pkg set scripts.dev="ts-node-dev --respawn --transpile-only src/app/server.ts"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/app/server.js"
npm pkg set scripts.lint="eslint \"src/**/*.{ts,tsx}\""
npm pkg set scripts.lint:fix="eslint \"src/**/*.{ts,tsx}\" --fix"
npm pkg set scripts.arch:check="depcruise src --config dependency-cruiser.config.js"
npm pkg set scripts.test="jest"
npm pkg set lint-staged.\"*.{ts,tsx}\"="eslint --fix"

# 10) Husky pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npx --no-install lint-staged && npm run arch:check && npm test"
git add .husky/pre-commit | Out-Null

# 11) Create source folders
New-Item -ItemType Directory -Force -Path src/app, src/features/{health,hello,tmsSoap}/{application,domain,infrastructure,interfaces/{http,graphql}}, src/shared/{logger,validation,events,soap,adapters,tms,utils} | Out-Null

# ---------------- APP ----------------
@"
import 'reflect-metadata';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import routes from '@app/routes';

import { healthResolver } from '@features/health/interfaces/graphql/health.resolver';
import { helloResolver } from '@features/hello/interfaces/graphql/hello.resolver';
import { tmsSoapResolver } from '@features/tmsSoap/interfaces/graphql/tmsSoap.resolver';

async function startServer() {
  const app = express();
  app.use(express.json());

  // REST
  app.use('/api', routes);

  // GraphQL
  const typeDefs = gql`
    type HealthStatus { status: String, timestamp: String }
    type HelloMessage { message: String }
    type SoapResult { success: Boolean, payload: String }
    type Query {
      health: HealthStatus
      hello(name: String): HelloMessage
      shipmentStatus(id: String!): SoapResult
    }
  `;
  const resolvers = [healthResolver, helloResolver, tmsSoapResolver];
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(\`🚀 http://localhost:\${port}\`));
}
startServer();
"@ | Set-Content src/app/server.ts -Encoding UTF8

@"
import { Router } from 'express';
import healthRoutes from '@features/health/interfaces/http/health.routes';
import helloRoutes from '@features/hello/interfaces/http/hello.routes';
import tmsSoapRoutes from '@features/tmsSoap/interfaces/http/tmsSoap.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/hello', helloRoutes);
router.use('/tms', tmsSoapRoutes);

export default router;
"@ | Set-Content src/app/routes.ts -Encoding UTF8

# ---------------- SHARED: LOGGER ----------------
@"
export interface ILogger {
  info(msg: string, meta?: any): void;
  error(msg: string, meta?: any): void;
}
"@ | Set-Content src/shared/logger/ILogger.ts -Encoding UTF8

@"
import { ILogger } from './ILogger';

export class ConsoleLogger implements ILogger {
  info(msg: string, meta?: any) { console.log('[INFO]', msg, meta ?? ''); }
  error(msg: string, meta?: any) { console.error('[ERROR]', msg, meta ?? ''); }
}
"@ | Set-Content src/shared/logger/consoleLogger.ts -Encoding UTF8

@"
import pino from 'pino';
import { ILogger } from './ILogger';

export class PinoLogger implements ILogger {
  private logger = pino();
  info(msg: string, meta?: any) { this.logger.info(meta ?? {}, msg); }
  error(msg: string, meta?: any) { this.logger.error(meta ?? {}, msg); }
}
"@ | Set-Content src/shared/logger/pinoLogger.ts -Encoding UTF8

@"
import { ILogger } from './ILogger';
import { ConsoleLogger } from './consoleLogger';
import { PinoLogger } from './pinoLogger';

const strategy = (process.env.LOGGER || 'console').toLowerCase();

let logger: ILogger;
switch (strategy) {
  case 'pino': logger = new PinoLogger(); break;
  case 'console':
  default: logger = new ConsoleLogger(); break;
}

export default logger;
"@ | Set-Content src/shared/logger/index.ts -Encoding UTF8

# ---------------- SHARED: VALIDATION ----------------
@"
export interface IValidator {
  validate<T>(schema: any, data: T): void;
}
"@ | Set-Content src/shared/validation/IValidator.ts -Encoding UTF8

@"
import Joi from 'joi';
import { IValidator } from './IValidator';

export class JoiValidator implements IValidator {
  validate<T>(schema: Joi.ObjectSchema, data: T) {
    const { error } = schema.validate(data);
    if (error) throw error;
  }
}
"@ | Set-Content src/shared/validation/joiValidator.ts -Encoding UTF8

@"
import { z } from 'zod';
import { IValidator } from './IValidator';

export class ZodValidator implements IValidator {
  validate<T>(schema: z.ZodTypeAny, data: T) {
    schema.parse(data);
  }
}
"@ | Set-Content src/shared/validation/zodValidator.ts -Encoding UTF8

@"
import { IValidator } from './IValidator';
import { JoiValidator } from './joiValidator';
import { ZodValidator } from './zodValidator';

const strategy = (process.env.VALIDATOR || 'joi').toLowerCase();

let validator: IValidator;
switch (strategy) {
  case 'zod': validator = new ZodValidator(); break;
  case 'joi':
  default: validator = new JoiValidator(); break;
}

export default validator;
"@ | Set-Content src/shared/validation/index.ts -Encoding UTF8

# ---------------- SHARED: EVENTS ----------------
@"
export interface IEventBus {
  publish(event: string, payload: any): Promise<void> | void;
  subscribe(event: string, handler: (payload: any) => Promise<void> | void): void;
}
"@ | Set-Content src/shared/events/IEventBus.ts -Encoding UTF8

@"
import { IEventBus } from './IEventBus';

export class InMemoryEventBus implements IEventBus {
  private handlers: Record<string, Array<(p: any) => void | Promise<void>>> = {};
  publish(event: string, payload: any) {
    (this.handlers[event] || []).forEach(h => h(payload));
  }
  subscribe(event: string, handler: (payload: any) => void | Promise<void>) {
    (this.handlers[event] ||= []).push(handler);
  }
}
"@ | Set-Content src/shared/events/InMemoryEventBus.ts -Encoding UTF8

@"
import { IEventBus } from './IEventBus';

export class KafkaEventBus implements IEventBus {
  publish(event: string, payload: any) {
    console.log('[Kafka stub] publish', event, payload);
  }
  subscribe(event: string) {
    console.log('[Kafka stub] subscribe', event);
  }
}
"@ | Set-Content src/shared/events/KafkaEventBus.ts -Encoding UTF8

@"
import { IEventBus } from './IEventBus';

export class RabbitEventBus implements IEventBus {
  publish(event: string, payload: any) {
    console.log('[RabbitMQ stub] publish', event, payload);
  }
  subscribe(event: string) {
    console.log('[RabbitMQ stub] subscribe', event);
  }
}
"@ | Set-Content src/shared/events/RabbitEventBus.ts -Encoding UTF8

@"
import { IEventBus } from './IEventBus';
import { InMemoryEventBus } from './InMemoryEventBus';
import { KafkaEventBus } from './KafkaEventBus';
import { RabbitEventBus } from './RabbitEventBus';

const strategy = (process.env.EVENTBUS || 'memory').toLowerCase();

let eventBus: IEventBus;
switch (strategy) {
  case 'kafka': eventBus = new KafkaEventBus(); break;
  case 'rabbit': eventBus = new RabbitEventBus(); break;
  case 'memory':
  default: eventBus = new InMemoryEventBus(); break;
}

export default eventBus;
"@ | Set-Content src/shared/events/eventBusFactory.ts -Encoding UTF8

# ---------------- SHARED: SOAP + ADAPTERS + TMS ----------------
@"
export interface ISoapClient {
  call(method: string, args: any): Promise<{ success: boolean; payload: string }>;
}
"@ | Set-Content src/shared/soap/ISoapClient.ts -Encoding UTF8

@"
import axios from 'axios';
import { ISoapClient } from './ISoapClient';

export class AxiosSoapClient implements ISoapClient {
  async call(method: string, args: any) {
    // Stub; implement SOAP envelope build and POST via axios
    return { success: true, payload: '<xml>axios soap stub</xml>' };
  }
}
"@ | Set-Content src/shared/soap/soapClient.axios.ts -Encoding UTF8

@"
import { ISoapClient } from './ISoapClient';

export class StrongSoapClient implements ISoapClient {
  async call(method: string, args: any) {
    // Stub; implement strong-soap client call
    return { success: true, payload: '<xml>strong-soap stub</xml>' };
  }
}
"@ | Set-Content src/shared/soap/soapClient.strong.ts -Encoding UTF8

@"
import { ISoapClient } from './ISoapClient';
import { AxiosSoapClient } from './soapClient.axios';
import { StrongSoapClient } from './soapClient.strong';

const choice = (process.env.SOAP_CLIENT || 'axios').toLowerCase();

let client: ISoapClient;
switch (choice) {
  case 'strong': client = new StrongSoapClient(); break;
  case 'axios':
  default: client = new AxiosSoapClient(); break;
}

export default client;
"@ | Set-Content src/shared/soap/soapClientFactory.ts -Encoding UTF8

@"
import soapClient from '@shared/soap/soapClientFactory';

const soapAdapter = {
  async call(method: string, args: any) {
    return soapClient.call(method, args);
  }
};

export default soapAdapter;
"@ | Set-Content src/shared/adapters/soapAdapter.ts -Encoding UTF8

@"
export interface ITmsWrapper {
  shipmentStatus(id: string, options?: { format?: 'xml' | 'json' }): Promise<{ success: boolean; payload: string }>;
}
"@ | Set-Content src/shared/tms/ITmsWrapper.ts -Encoding UTF8

@"
import soapAdapter from '@shared/adapters/soapAdapter';
import { ITmsWrapper } from './ITmsWrapper';
import { xmlToJson } from '@shared/utils/xml';

export class TmsWrapper implements ITmsWrapper {
  async shipmentStatus(id: string, options?: { format?: 'xml' | 'json' }) {
    const res = await soapAdapter.call('getShipmentStatus', { id });
    if ((options?.format || 'xml') === 'json') {
      const json = xmlToJson(res.payload);
      return { success: res.success, payload: JSON.stringify(json) };
    }
    return res;
  }
}
"@ | Set-Content src/shared/tms/TmsWrapper.ts -Encoding UTF8

@"
export function xmlToJson(xml: string): any {
  // Minimal stub; replace with a real parser if needed
  return { xml };
}
"@ | Set-Content src/shared/utils/xml.ts -Encoding UTF8

# ---------------- FEATURES: HEALTH ----------------
@"
export function checkHealth() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
"@ | Set-Content src/features/health/application/checkHealth.ts -Encoding UTF8

@"
export type HealthStatus = { status: string; timestamp: string };
"@ | Set-Content src/features/health/domain/healthStatus.ts -Encoding UTF8

@"
import { checkHealth } from '../application/checkHealth';
export class HealthRepository {
  getStatus() { return checkHealth(); }
}
"@ | Set-Content src/features/health/infrastructure/healthRepository.ts -Encoding UTF8

@"
import { Request, Response } from 'express';
import { HealthRepository } from '../../infrastructure/healthRepository';
export const healthController = {
  get: (req: Request, res: Response) => {
    res.json(new HealthRepository().getStatus());
  }
};
"@ | Set-Content src/features/health/interfaces/http/health.controller.ts -Encoding UTF8

@"
import { Router } from 'express';
import { healthController } from './health.controller';
const router = Router();
router.get('/', healthController.get);
export default router;
"@ | Set-Content src/features/health/interfaces/http/health.routes.ts -Encoding UTF8

@"
export const healthResolver = {
  Query: {
    health: () => ({ status: 'ok', timestamp: new Date().toISOString() })
  }
};
"@ | Set-Content src/features/health/interfaces/graphql/health.resolver.ts -Encoding UTF8

# ---------------- FEATURES: HELLO ----------------
@"
export function sayHello(name: string) {
  return { message: \`Hello, \${name || 'World'}!\` };
}
"@ | Set-Content src/features/hello/application/sayHello.ts -Encoding UTF8

@"
export type HelloMessage = { message: string };
"@ | Set-Content src/features/hello/domain/helloMessage.ts -Encoding UTF8

@"
import { sayHello } from '../application/sayHello';
export class HelloRepository {
  greet(name: string) { return sayHello(name); }
}
"@ | Set-Content src/features/hello/infrastructure/helloRepository.ts -Encoding UTF8

@"
import { Request, Response } from 'express';
import { HelloRepository } from '../../infrastructure/helloRepository';
export const helloController = {
  get: (req: Request, res: Response) => {
    res.json(new HelloRepository().greet(req.query.name as string));
  }
};
"@ | Set-Content src/features/hello/interfaces/http/hello.controller.ts -Encoding UTF8

@"
import { Router } from 'express';
import { helloController } from './hello.controller';
const router = Router();
router.get('/', helloController.get);
export default router;
"@ | Set-Content src/features/hello/interfaces/http/hello.routes.ts -Encoding UTF8

@"
export const helloResolver = {
  Query: {
    hello: (_: any, { name }: { name: string }) => ({ message: \`Hello, \${name || 'World'}!\` })
  }
};
"@ | Set-Content src/features/hello/interfaces/graphql/hello.resolver.ts -Encoding UTF8

# ---------------- FEATURES: TMS SOAP ----------------
@"
export type SoapResult = { success: boolean; payload: string };
"@ | Set-Content src/features/tmsSoap/domain/soapResult.ts -Encoding UTF8

@"
import { TmsWrapper } from '@shared/tms/TmsWrapper';
export class SoapRepository {
  private tms = new TmsWrapper();
  async getShipmentStatus(id: string) {
    return this.tms.shipmentStatus(id, { format: 'json' });
  }
}
"@ | Set-Content src/features/tmsSoap/infrastructure/soapRepository.ts -Encoding UTF8

@"
import { Request, Response } from 'express';
import { SoapRepository } from '../../infrastructure/soapRepository';
export const tmsSoapController = {
  status: async (req: Request, res: Response) => {
    const repo = new SoapRepository();
    const result = await repo.getShipmentStatus(req.params.id);
    res.json(result);
  }
};
"@ | Set-Content src/features/tmsSoap/interfaces/http/tmsSoap.controller.ts -Encoding UTF8

@"
import { Router } from 'express';
import { tmsSoapController } from './tmsSoap.controller';
const router = Router();
router.get('/status/:id', tmsSoapController.status);
export default router;
"@ | Set-Content src/features/tmsSoap/interfaces/http/tmsSoap.routes.ts -Encoding UTF8

@"
import { SoapRepository } from '../../infrastructure/soapRepository';
export const tmsSoapResolver = {
  Query: {
    shipmentStatus: async (_: any, { id }: { id: string }) => {
      return new SoapRepository().getShipmentStatus(id);
    }
  }
};
"@ | Set-Content src/features/tmsSoap/interfaces/graphql/tmsSoap.resolver.ts -Encoding UTF8

Write-Host "✅ Project $ProjectName created successfully."
Write-Host "👉 Next steps:"
Write-Host "   cd $ProjectName"
Write-Host "   npm install"
Write-Host "   npm run dev   # REST: http://localhost:3000/api/health | GraphQL: /graphql"
Write-Host "   # Pre-commit hook runs lint-staged + arch:check + tests"
