import { BadRequestException, Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from 'src/database/database.module';
import { diskStorage } from 'multer';
import { extname } from 'path';

// File filter to allow only certain file types
function fileFilter(req: any, file: Express.Multer.File, callback: Function) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    return callback(new BadRequestException('Only image and PDF files are allowed!'), false);
  }
  callback(null, true);
}

// Custom filename generator
function editFileName(req: any, file: Express.Multer.File, callback: Function) {
  const name = file.originalname.split('.')[0].replace(/\s+/g, '_');
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}_${randomName}${fileExtName}`);
}

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/avatars',
      storage: diskStorage({
        filename: editFileName,
      }),
      fileFilter: fileFilter,
    }),
    DatabaseModule,
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
