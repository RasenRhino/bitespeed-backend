import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { IdentityUploadDto } from './dto/identity-upload.dto';
import { AuthGuard } from 'src/iam/login/decorators/auth-guard.decorator';
import { AuthType } from 'src/iam/login/enums/auth-type.enum';
import { IdentityDto } from './dto/identity.dto';
import { IdentityService } from './identity.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Contact')
@AuthGuard(AuthType.None)
@Controller()
export class IdentityController {
    constructor(private identityService:IdentityService) {}
    
    //create a /identity endpoint which will have the body of the tupe identity-upload.dto.ts and will print the post body to the console
    @Post('/identity')
    async identity(
        @Body() body: IdentityUploadDto,
    ):Promise<any> {
        let identity:IdentityDto = {
            email: body.email,
            phoneNumber: body.phoneNumber,
            linkPrecedence: "",
        }
        

    }

    //create a /identitydb endpoint which will populate the table of the database with the identity.upload.dto.ts body
    @Post('/identitydb')
    async identitydb(
        @Body() body: IdentityDto,
    ):Promise<any> {
        try{
            this.identityService.addIdentity(body);
        }
        catch(e){
            console.log(e);
            throw new InternalServerErrorException('failed to add new feild to the database');  
        }
    }

}
