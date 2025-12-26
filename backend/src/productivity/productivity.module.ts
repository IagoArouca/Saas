import { Module } from '@nestjs/common';
import { ProductivityService } from './productivity.service';
import { ProductivityController } from './productivity.controller';

@Module({
  providers: [ProductivityService],
  controllers: [ProductivityController]
})
export class ProductivityModule {}
