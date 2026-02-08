import { Module } from '@nestjs/common';
import { JwtStrategyService } from './jwt-strategy/jwt-strategy.service';
import { RefreshStrategyService } from './refresh-strategy/refresh-strategy.service';

@Module({
  providers: [JwtStrategyService, RefreshStrategyService],
})
export class StrategiesModule {}
