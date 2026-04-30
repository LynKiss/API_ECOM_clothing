"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipCheckPermission = exports.IS_PUBLIC_PERMISSION = exports.User = exports.RequirePermissions = exports.PERMISSIONS_KEY = exports.ResponseMessage = exports.RESPONSE_MESSAGE = exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
exports.RESPONSE_MESSAGE = 'response_message';
const ResponseMessage = (message) => (0, common_1.SetMetadata)(exports.RESPONSE_MESSAGE, message);
exports.ResponseMessage = ResponseMessage;
exports.PERMISSIONS_KEY = 'permissions';
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.RequirePermissions = RequirePermissions;
exports.User = (0, common_2.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
exports.IS_PUBLIC_PERMISSION = 'isPublicPermission';
const SkipCheckPermission = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_PERMISSION, true);
exports.SkipCheckPermission = SkipCheckPermission;
//# sourceMappingURL=customize.js.map