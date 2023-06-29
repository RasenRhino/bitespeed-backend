import { Body, Controller, HttpStatus, InternalServerErrorException, Post, Res } from '@nestjs/common';
import { IdentityUploadDto } from './dto/identity-upload.dto';
import { IdentityDto } from './dto/identity.dto';
import { IdentityService } from './identity.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/iam/login/decorators/auth-guard.decorator';
import { AuthType } from 'src/iam/login/enums/auth-type.enum';
import { Output, Contact } from './interface/output.interface'

@ApiTags('Contact')
@AuthGuard(AuthType.None)
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

        const existingIdentities = [...identitiesByEmail, ...identitiesByPhoneNumber];

        if (existingIdentities.length > 0) {
            const primaryIdentity = existingIdentities.sort((a, b) => a.createdAt - b.createdAt)[0];
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
            let allEmails = [];
            for (let i = 0; i < existingIdentities.length; i++) {
                const email = existingIdentities[i].email;
                if(email)
                    allEmails.push(email);
            }
            let allPhoneNumbers = [];
            for (let i = 0; i < existingIdentities.length; i++) {
                const phoneNumber = existingIdentities[i].phoneNumber;
                if(phoneNumber)
                allPhoneNumbers.push(phoneNumber);
            }
            let allContacts = await this.identityService.getAllIdentities();
            let secondaryContactIds = [];
            for (let i = 0; i < allContacts.length; i++) {
                const secondaryContactId = allContacts[i].linkedId;
                if(secondaryContactId && secondaryContactId === primaryIdentity.id)
                secondaryContactIds.push(secondaryContactId);
            }
            console.log({existingIdentities})
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

            // res.status(HttpStatus.OK).json({ message: 'Updated existing identities and added new identity if needed' });
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
                await this.identityService.addIdentity(identity);
                res.status(HttpStatus.OK).json({ message: 'Added new identity' });
            } catch(e) {
                console.log({e});
                throw new InternalServerErrorException('Failed to add new field');

            }
        }
    }
}