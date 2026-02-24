import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../backend/src/app.module';

const server = express();
let isInitialized = false;

const initServer = async () => {
  if (isInitialized) {
    return;
  }

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.init();
  isInitialized = true;
};

export default async (req: any, res: any) => {
  await initServer();
  return server(req, res);
};
