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
    //a service to find all identities  by email 
    async findIdentityByEmail(email:string):Promise<Identity[]>{
        return this.idrepo.find({
            where:{
                email:email
            }
        });
    }

    //a service to find all identities  by phoneNumber
    async findIdentityByPhoneNumber(phoneNumber:string):Promise<Identity[]>{
        return this.idrepo.find({
            where:{
                phoneNumber:phoneNumber
            }
        });
    }

    //a service to find all identities by linkedId
    async findIdentityByLinkedId(linkedId:number):Promise<Identity[]>{
        return this.idrepo.find({
            where:{
                linkedId:linkedId
            }
        });
    }

    //a service to update the identity
    async updateIdentity(identity:IdentityDto):Promise<Identity>{
        return this.idrepo.save({
            ...identity
        });
    }

    //update the identity link
    async updateIdentityLink(id:number,linkedId:number):Promise<Identity>{
        return this.idrepo.save({
            id:id,
            linkedId:linkedId,
            linkPrecedence:"secondary"
        });
    }

    //get all identities
    async getAllIdentities():Promise<Identity[]>{
        return this.idrepo.find();
    }
}
