import { Test, TestingModule } from '@nestjs/testing';
import { ServerManagerController } from './server-manager.controller';

describe('ServerManagerController', () => {
  let controller: ServerManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerManagerController],
    }).compile();

    controller = module.get<ServerManagerController>(ServerManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
