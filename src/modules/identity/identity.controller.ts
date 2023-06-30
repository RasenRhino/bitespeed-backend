import { Body, Controller, HttpStatus, InternalServerErrorException, Post, Res } from '@nestjs/common';
import { IdentityUploadDto } from './dto/identity-upload.dto';
import { IdentityDto } from './dto/identity.dto';
import { IdentityService } from './identity.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Output, Contact } from './interface/output.interface'
import { Identity } from './entities/identity.entity';

@ApiTags('Contact')
@Controller()
export class IdentityController {
    constructor(private identityService:IdentityService) {}

    @Post('/identity')
    async identity(
        @Body() body: IdentityUploadDto,
        @Res() res: Response,
    ): Promise<any> {
        let identitiesByEmail = [];
        let identitiesByPhoneNumber = [];
        if (body.email) {
            identitiesByEmail = await this.identityService.findIdentityByEmail(body.email);
        }
        if (body.phoneNumber) {
            identitiesByPhoneNumber = await this.identityService.findIdentityByPhoneNumber(body.phoneNumber);
        }

        let existingIdentities = [...identitiesByEmail, ...identitiesByPhoneNumber];
        let primaryIdentity = existingIdentities.sort((a, b) => a.createdAt - b.createdAt)[0];
        if (existingIdentities.length > 0) {
            if(primaryIdentity.linkPrecedence != "secondary"){
                const identitiesToUpdate = existingIdentities.filter(identity => identity.linkedId !== primaryIdentity.id);
                for (const identity of identitiesToUpdate) {
                    if(identity.id !== primaryIdentity.id)
                    await this.identityService.updateIdentityLink(identity.id, primaryIdentity.id);
                }
                const emailExists = existingIdentities.some(identity => identity.email === body.email);
                const phoneNumberExists = existingIdentities.some(identity => identity.phoneNumber === body.phoneNumber);

                if (body.email && !emailExists || body.phoneNumber && !phoneNumberExists) {
                    const newIdentity: IdentityDto = {
                        email: body.email,
                        phoneNumber: body.phoneNumber,
                        linkPrecedence: "secondary",
                        linkedId: primaryIdentity.id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null
                    };

                    await this.identityService.addIdentity(newIdentity);

                }
            }
            let allEmails = [];
            let allPhoneNumbers = [];
            let secondaryContactIds = [];
            let length=existingIdentities.length;
            let toadd=[];
            for(let i=0;i<length;i++){
                const email = existingIdentities[i].email;
                const phoneNumber = existingIdentities[i].phoneNumber;
                if(body.email && !body.phoneNumber){
                    let temp=await this.identityService.findIdentityByPhoneNumber(phoneNumber);
                    if(temp.length>0){
                        toadd=[...toadd,...temp]
                    }
                }
                if(body.phoneNumber && !body.email){
                    let temp=await this.identityService.findIdentityByEmail(email);
                    if(temp.length>0){
                        toadd=[...toadd,...temp]
                    }
                }
            }
            existingIdentities=[...existingIdentities,...toadd];
            for (let i = 0; i < existingIdentities.length; i++) {
                const email = existingIdentities[i].email;
                const phoneNumber = existingIdentities[i].phoneNumber;
                if(email && !allEmails.includes(email))
                    allEmails.push(email);
                if(phoneNumber && !allPhoneNumbers.includes(phoneNumber))
                    allPhoneNumbers.push(phoneNumber);
            }
            let allContacts = await this.identityService.getAllIdentities();
            if(primaryIdentity.linkPrecedence == "secondary"){
                primaryIdentity = existingIdentities.sort((a, b) => a.createdAt - b.createdAt)[0];
                console.log({primaryIdentity})
            }
            for (let i = 0; i < allContacts.length; i++) {
                const secondaryContactId = allContacts[i].id;
                if(secondaryContactId && allContacts[i].linkedId == primaryIdentity.id)
                secondaryContactIds.push(secondaryContactId);
            }
            
            allEmails = [...new Set(allEmails)];
            allPhoneNumbers = [...new Set(allPhoneNumbers)];
            secondaryContactIds = [...new Set(secondaryContactIds)];
            const contact: Contact = {
                primaryContactId: primaryIdentity.id,
                emails: allEmails,
                phoneNumbers: allPhoneNumbers,
                secondaryContactIds: secondaryContactIds
            }
            const output: Output = {
                contact: contact
            }
            res.status(HttpStatus.OK).json(output);
        } else {
            let identity: IdentityDto = {
                email: body.email,
                phoneNumber: body.phoneNumber,
                linkPrecedence: "primary",
                linkedId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            }
            try {
                let newContact=await this.identityService.addIdentity(identity);
                const contact : Contact = {
                    primaryContactId: newContact.id,
                    emails: [newContact.email],
                    phoneNumbers: [newContact.phoneNumber],
                    secondaryContactIds: []
                }
                const output: Output = {
                    contact: contact
                }
                res.status(HttpStatus.OK).json(output);

                // res.status(HttpStatus.OK).json({ message: 'Added new identity' });

            } catch(e) {
                console.log({e});
                throw new InternalServerErrorException('Failed to add new field');
            }
        }
    }
}