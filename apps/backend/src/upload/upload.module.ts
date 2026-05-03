import { UploadController } from './upload.controller';
import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
