"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const enums_1 = require("../../enums");
let RolesGuard = class RolesGuard {
    constructor(reflector, configService) {
        this.reflector = reflector;
        this.configService = configService;
    }
    getChild(childId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.configService.getOrThrow("AUTH_SERVICE")}/child/get_child_auth?childId=${childId}`);
            return response.data;
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.configService.getOrThrow("AUTH_SERVICE")}/user/find-user-for-auth?userId=${userId}`);
            return response.data;
        });
    }
    getChildForPreschool(childId, preschoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.configService.getOrThrow("AUTH_SERVICE")}/child/get_child_prescool_auth?childId=${childId}&preschoolId=${preschoolId}`);
            return response.data;
        });
    }
    getClinicDetails(clinicId, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.configService.getOrThrow("AUTH_SERVICE")}/user/get_clinic_details_auth?clinicId=${clinicId}&docId=${docId}`);
            return response.data;
        });
    }
    canActivate(context) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            // fetching roles value via @Roles() decorator
            const roles = this.reflector.get("roles", context.getHandler());
            const isNew = this.reflector.get("isNew", context.getHandler());
            const { user, query, body } = context.switchToHttp().getRequest();
            // matching decorator values with accessToken(userType) value
            if ((roles === null || roles === void 0 ? void 0 : roles.includes(user === null || user === void 0 ? void 0 : user.userType)) || roles === undefined) {
                // check validation for PARENT user
                if ((roles === null || roles === void 0 ? void 0 : roles.includes(enums_1.UserType.PARENT)) &&
                    (user === null || user === void 0 ? void 0 : user.userType) === enums_1.UserType.PARENT) {
                    if ((query === null || query === void 0 ? void 0 : query.childId) || (query === null || query === void 0 ? void 0 : query.childID) || (body === null || body === void 0 ? void 0 : body.childID)) {
                        const child = yield this.getChild(query.childId || (query === null || query === void 0 ? void 0 : query.childID) || (body === null || body === void 0 ? void 0 : body.childID));
                        if (((_a = child === null || child === void 0 ? void 0 : child.motherInfo) === null || _a === void 0 ? void 0 : _a.parentId) === (user === null || user === void 0 ? void 0 : user.userId) ||
                            ((_b = child === null || child === void 0 ? void 0 : child.fatherInfo) === null || _b === void 0 ? void 0 : _b.parentId) === (user === null || user === void 0 ? void 0 : user.userId)) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                    if (query === null || query === void 0 ? void 0 : query.parentId) {
                        if ((query === null || query === void 0 ? void 0 : query.parentId) === user.userId) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                    if (query === null || query === void 0 ? void 0 : query.userId) {
                        if ((query === null || query === void 0 ? void 0 : query.userId) === user.userId) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                    return true;
                }
                // check validation for PRESCHOOL user
                if ((roles === null || roles === void 0 ? void 0 : roles.includes(enums_1.UserType.PRESCHOOL)) &&
                    (user === null || user === void 0 ? void 0 : user.userType) === enums_1.UserType.PRESCHOOL) {
                    if (((query === null || query === void 0 ? void 0 : query.childID) && (query === null || query === void 0 ? void 0 : query.centerId)) ||
                        ((body === null || body === void 0 ? void 0 : body.childID) && (body === null || body === void 0 ? void 0 : body.centerId))) {
                        const child = yield this.getChildForPreschool(query.childID || (body === null || body === void 0 ? void 0 : body.childID), user === null || user === void 0 ? void 0 : user.userId);
                        if (child) {
                            return true;
                        }
                        else if (isNew) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                    if ((query === null || query === void 0 ? void 0 : query.preschoolId) || (body === null || body === void 0 ? void 0 : body.preschoolId)) {
                        if (query.preschoolId === user.userId ||
                            (body === null || body === void 0 ? void 0 : body.preschoolId) === user.userId) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission ghfghfgh!");
                    }
                    if (((query === null || query === void 0 ? void 0 : query.centerId) || body.centerId) && !query.childID) {
                        if (query.centerId === user.userId || body.centerId === user.userId) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                    if ((body === null || body === void 0 ? void 0 : body.childId) || (query === null || query === void 0 ? void 0 : query.childId)) {
                        const child = yield this.getChildForPreschool((body === null || body === void 0 ? void 0 : body.childId) || (query === null || query === void 0 ? void 0 : query.childId), user === null || user === void 0 ? void 0 : user.userId);
                        if (child) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                }
                // check validation for clinic user
                if ((roles === null || roles === void 0 ? void 0 : roles.includes(enums_1.UserType.CLINIC)) &&
                    (user === null || user === void 0 ? void 0 : user.userType) === enums_1.UserType.CLINIC) {
                    if ((body === null || body === void 0 ? void 0 : body.childId) || (query === null || query === void 0 ? void 0 : query.childId)) {
                        const child = (_d = (_c = (yield this.getChild((body === null || body === void 0 ? void 0 : body.childId) || (query === null || query === void 0 ? void 0 : query.childId)))) === null || _c === void 0 ? void 0 : _c.clinicInfo) === null || _d === void 0 ? void 0 : _d.find((val) => (val === null || val === void 0 ? void 0 : val.id) === (user === null || user === void 0 ? void 0 : user.userId));
                        if (child) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                    if (query === null || query === void 0 ? void 0 : query.docId) {
                        const clinic = yield this.getClinicDetails(user.userId, query === null || query === void 0 ? void 0 : query.docId);
                        if (clinic) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                }
                // check validation for doctor user
                if ((roles === null || roles === void 0 ? void 0 : roles.includes(enums_1.UserType.DOCTOR)) &&
                    (user === null || user === void 0 ? void 0 : user.userType) === enums_1.UserType.DOCTOR) {
                    if (body === null || body === void 0 ? void 0 : body.childId) {
                        const child = (_f = (_e = (yield this.getChild(body === null || body === void 0 ? void 0 : body.childId))) === null || _e === void 0 ? void 0 : _e.doctorInfo) === null || _f === void 0 ? void 0 : _f.find((val) => (val === null || val === void 0 ? void 0 : val.id) === (user === null || user === void 0 ? void 0 : user.userId));
                        if (child) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                }
                // check validation for teacher user
                if ((roles === null || roles === void 0 ? void 0 : roles.includes(enums_1.UserType.TEACHER)) &&
                    (user === null || user === void 0 ? void 0 : user.userType) === enums_1.UserType.TEACHER) {
                    /*
                      Validation Logic 1 :
                        - if the preschool Id has been sent via the query then directly check if the preschool is common for teacher and child
                    */
                    if ((body === null || body === void 0 ? void 0 : body.childId) ||
                        (query === null || query === void 0 ? void 0 : query.childId) ||
                        (query === null || query === void 0 ? void 0 : query.childID) ||
                        (body === null || body === void 0 ? void 0 : body.childID)) {
                        if ((query === null || query === void 0 ? void 0 : query.centerId) ||
                            (query === null || query === void 0 ? void 0 : query.centerID) ||
                            (body === null || body === void 0 ? void 0 : body.centerID) ||
                            (body === null || body === void 0 ? void 0 : body.centerId)) {
                            const child = yield this.getChildForPreschool((body === null || body === void 0 ? void 0 : body.childId) || (query === null || query === void 0 ? void 0 : query.childId) || query.childID || (body === null || body === void 0 ? void 0 : body.childID), (query === null || query === void 0 ? void 0 : query.centerId) ||
                                (query === null || query === void 0 ? void 0 : query.centerID) ||
                                (body === null || body === void 0 ? void 0 : body.centerID) ||
                                (body === null || body === void 0 ? void 0 : body.centerId));
                            if (!child) {
                                throw new common_1.ForbiddenException("Insufficient Permission!");
                            }
                            const teacher = (_g = (yield this.getUser(user.userId))) === null || _g === void 0 ? void 0 : _g.preschoolDetails.find((val) => val.preschoolId ===
                                ((query === null || query === void 0 ? void 0 : query.centerId) ||
                                    (query === null || query === void 0 ? void 0 : query.centerID) ||
                                    (body === null || body === void 0 ? void 0 : body.centerID) ||
                                    (body === null || body === void 0 ? void 0 : body.centerId)));
                            if (!teacher) {
                                throw new common_1.ForbiddenException("Insufficient Permission!");
                            }
                            return true;
                        }
                        /*
                          Validation Logic 2 :
                            - if there exists a preschool where a child is registered and also the teacher is also registered then return true
                        */
                        const child = yield this.getChild((body === null || body === void 0 ? void 0 : body.childId) || (query === null || query === void 0 ? void 0 : query.childId) || query.childID || (body === null || body === void 0 ? void 0 : body.childID));
                        const teacher = yield this.getUser(user.userId);
                        if (this.checkCommonPreschoolInUserAndChild(teacher, child)) {
                            return true;
                        }
                        throw new common_1.ForbiddenException("Insufficient Permission!");
                    }
                }
                return true;
            }
            return false;
        });
    }
    /* Checks if there is any common preschool among the teacher and the child for verification purposes */
    checkCommonPreschoolInUserAndChild(user, child) {
        let isCommon = false;
        user.preschoolDetails.forEach((teacherPreschool) => child.preSchoolInfo.forEach((childPreschool) => {
            if (teacherPreschool.preschoolId === childPreschool.id) {
                isCommon = true;
                return true;
            }
        }));
        return isCommon;
    }
};
RolesGuard = __decorate([
    (0, common_1.Injectable)()
], RolesGuard);
exports.RolesGuard = RolesGuard;
