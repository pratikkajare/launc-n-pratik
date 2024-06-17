import { CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
export declare class RolesGuard implements CanActivate {
    private reflector;
    private readonly configService;
    constructor(reflector: Reflector, configService: ConfigService);
    getChild(childId: string): Promise<any>;
    getUser(userId: string): Promise<any>;
    getChildForPreschool(childId: string, preschoolId: string): Promise<any>;
    getClinicDetails(clinicId: string, docId: string): Promise<any>;
    canActivate(context: ExecutionContext): Promise<boolean>;
    checkCommonPreschoolInUserAndChild(user: any, child: any): boolean;
}
