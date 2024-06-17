import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { ScreenMessageType, UserType } from "../../enums";
import { JwtPayload } from "../../types";
declare const AccessTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    getLoggingEvent(userId: string, userType: UserType, type: ScreenMessageType): Promise<string>;
    validate(req: Request, payload: JwtPayload): Promise<JwtPayload>;
}
export {};
