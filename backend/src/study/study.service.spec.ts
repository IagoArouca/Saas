import { Test, TestingModule } from '@nestjs/testing';
import { StudyTrackService } from './study.service';

describe('StudyService', () => {
  let service: StudyTrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyTrackService],
    }).compile();

    service = module.get<StudyTrackService>(StudyTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
