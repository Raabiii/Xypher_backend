import { Test, TestingModule } from '@nestjs/testing';
import { ServerManagerService } from './server-manager.service';

describe('ServerManagementService', () => {
  let service: ServerManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerManagerService],
    }).compile();

    service = module.get<ServerManagerService>(ServerManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
