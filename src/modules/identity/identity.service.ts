import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentityDto } from './dto/identity.dto';
import { Identity } from './entities/identity.entity';

@Injectable()
export class IdentityService {
constructor(
    @InjectRepository(Identity)
    private idrepo:Repository<Identity>
    ){}    
    async addIdentity(identity:IdentityDto):Promise<Identity> {  
        return this.idrepo.save({
            ...identity
        });
    }
}
