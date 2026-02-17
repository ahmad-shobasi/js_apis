import { Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('user-profile')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(private profileService: UserProfileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@CurrentUser() user, @UploadedFile() file: Express.Multer.File) {
    return this.profileService.setAvatar(user.id, file.filename);
  }

  @Get(':id')
  getUserProfile(@CurrentUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.profileService.getUserProfile(userId, id);
  }
}
