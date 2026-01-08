import { Test, TestingModule } from '@nestjs/testing';
import { StudyTrackController } from './study.controller';
import { StudyTrackService } from './study.service';

describe('StudyController', () => {
  let controller: StudyTrackController ;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyTrackController],
      providers: [StudyTrackService],
    }).compile();

    controller = module.get<StudyTrackController >(StudyTrackService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
