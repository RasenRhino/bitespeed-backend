import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Identity } from './entities/identity.entity';
@Module({
  controllers: [IdentityController],
  providers: [IdentityService],
  imports: [
    TypeOrmModule.forFeature([Identity]),
  ]
})
export class IdentityModule {}

