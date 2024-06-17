import { ExecutionContext } from "@nestjs/common";
import { JwtPayloadWithRefreshToken } from "../types";
export declare const getCurrentUserByContext: (context: ExecutionContext, data: keyof JwtPayloadWithRefreshToken | undefined) => unknown[];
export declare const CurrentUser: (...dataOrPipes: (keyof import("../types").JwtPayload | "refreshToken" | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
