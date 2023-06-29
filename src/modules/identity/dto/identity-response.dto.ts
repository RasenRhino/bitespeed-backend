import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Unique } from 'typeorm';
export class IdentityUploadDto {
    @IsString()
    @IsOptional()
    email: string | null;
  
    @IsString()
    @IsOptional()
    phoneNumber: string | null;
  }
  