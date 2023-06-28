import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Unique } from 'typeorm';
export class IdentityUploadDto{
    @IsString()
    email: string;

    @IsString()
    phoneNumber: string;

}