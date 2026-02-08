import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { StrategiesModule } from './strategies/strategies.module';
import { JwtStrategyService } from './strategies/jwt-strategy/jwt-strategy.service';
import { JWT_SECRET } from 'src/jwt.secret';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [DatabaseModule, PassportModule, JwtModule.register({}), StrategiesModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyService],
  exports: [AuthService],
})
export class AuthModule {}
