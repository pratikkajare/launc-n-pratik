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
exports.AccessTokenStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const axios_1 = __importDefault(require("axios"));
const passport_jwt_1 = require("passport-jwt");
const enums_1 = require("../../enums");
let AccessTokenStrategy = class AccessTokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "jwt") {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("ACCESS_TOKEN_SECRET"),
            passReqToCallback: true,
        });
        this.configService = configService;
    }
    getLoggingEvent(userId, userType, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.configService.getOrThrow("AUTH_SERVICE")}/loggingevent/accessTokens?userId=${userId}&userType=${userType}&type=${type}`);
            return response.data;
        });
    }
    validate(req, payload) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if ((req === null || req === void 0 ? void 0 : req.url) === "/auth/setPassword" &&
                ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.mobileNo) &&
                ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.mobileNo) !== (payload === null || payload === void 0 ? void 0 : payload.mobileNo)) {
                throw new common_1.UnauthorizedException();
            }
            const accessToken = yield this.getLoggingEvent(payload.userId, payload.userType, (req === null || req === void 0 ? void 0 : req.url) === "/auth/setPassword"
                ? enums_1.ScreenMessageType.SET_PASSWORD
                : enums_1.ScreenMessageType.LOGIN);
            if (accessToken &&
                accessToken === ((_d = (_c = req.headers) === null || _c === void 0 ? void 0 : _c.authorization) === null || _d === void 0 ? void 0 : _d.replace("Bearer ", ""))) {
                return Promise.resolve(payload);
            }
            throw new common_1.UnauthorizedException();
        });
    }
};
AccessTokenStrategy = __decorate([
    (0, common_1.Injectable)()
], AccessTokenStrategy);
exports.AccessTokenStrategy = AccessTokenStrategy;
