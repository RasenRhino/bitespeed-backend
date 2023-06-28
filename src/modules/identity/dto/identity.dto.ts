import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Unique } from 'typeorm';
export class IdentityDto{
    @IsString()
    email: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    linkedId:number;

    @IsString()
    @IsNotEmpty()
    linkPrecedence :string;
    
    @IsString()
    @IsNotEmpty()
    createdAt: Date;

    @IsString()
    @IsNotEmpty()
    updatedAt: Date;

    @IsString()
    deletedAt: Date;

}