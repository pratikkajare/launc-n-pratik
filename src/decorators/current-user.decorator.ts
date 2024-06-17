import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayloadWithRefreshToken } from "../types";

export const getCurrentUserByContext = (
  context: ExecutionContext,
  data: keyof JwtPayloadWithRefreshToken | undefined
): unknown[] => {
  const req = context.switchToHttp().getRequest();

  if (data) {
    return req.user[data];
  }
  return req.user;
};

export const CurrentUser = createParamDecorator(
  (
    data: keyof JwtPayloadWithRefreshToken | undefined,
    context: ExecutionContext
  ) => getCurrentUserByContext(context, data)
);
