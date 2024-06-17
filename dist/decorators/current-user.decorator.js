"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = exports.getCurrentUserByContext = void 0;
const common_1 = require("@nestjs/common");
const getCurrentUserByContext = (context, data) => {
    const req = context.switchToHttp().getRequest();
    if (data) {
        return req.user[data];
    }
    return req.user;
};
exports.getCurrentUserByContext = getCurrentUserByContext;
exports.CurrentUser = (0, common_1.createParamDecorator)((data, context) => (0, exports.getCurrentUserByContext)(context, data));
