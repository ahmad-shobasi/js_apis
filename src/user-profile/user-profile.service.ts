import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { UserProfileDtoResponse } from './dto/profile.dto';
import { ConfigService } from '@nestjs/config';

const profileCacheKey = (userId: number): string => `user:${userId}:profile`;

@Injectable()
export class UserProfileService {
  constructor(
    private $context: DatabaseService,
    private cacheService: RedisCacheService,
    private config: ConfigService,
  ) {}

  async setAvatar(userId: number, filename: string) {
    const avatarUrl = `/uploads/avatars/${filename}`;
    /* This connection checks the database if there is a profile it will update the avatarUrl.
     and if not it will create new one with givin data
     */
    await this.$context.userProfile.upsert({
      where: { userId },
      update: { avatarUrl },
      create: {
        userId,
        avatarUrl,
      },
    });
    await this.cacheService.removeItem(profileCacheKey(userId));
    return avatarUrl;
  }

  async getUserProfile(userId: number, id: number): Promise<UserProfileDtoResponse> {
    const cachedProfile = await this.cacheService.getItem(profileCacheKey(userId));
    const appUrl = this.config.get('appUrl');

    if (cachedProfile) return cachedProfile as UserProfileDtoResponse;

    const userProfile: UserProfileDtoResponse | null = await this.$context.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
      const profile = await tx.userProfile.findUnique({
        where: {
          userId,
          id,
        },
      });
      if (!user || !profile) return null;

      return {
        id: profile.id,
        userId: profile.userId,
        fullname: user.name,
        email: user.email,
        avatarUrl: appUrl + profile.avatarUrl,
      };
    });

    if (!userProfile) throw new NotFoundException();

    await this.cacheService.setItem(profileCacheKey(userId), userProfile);
    return userProfile;
  }
}
