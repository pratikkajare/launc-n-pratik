import { UserType } from '../enums/user-type.enum';
export type JwtPayload = {
    mobileNo: string;
    userId: string;
    userType: UserType;
};
export type JwtPayloadWithRefreshToken = JwtPayload & {
    refreshToken: string;
};
