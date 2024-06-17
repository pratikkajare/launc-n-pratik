"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityFunctionService = void 0;
const common_1 = require("@nestjs/common");
let UtilityFunctionService = class UtilityFunctionService {
    // add seconds, minutes or hours in current date
    addExtraTimeToDate(value, scheduledDate) {
        const currentDate = scheduledDate || new Date();
        const regex = /(\d+)\s*(s|m|h|ml)s?/i;
        const match = value.match(regex);
        if (!match) {
            throw new Error("Invalid input format");
        }
        const amount = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        switch (unit) {
            case "s":
                currentDate.setSeconds(currentDate.getSeconds() + amount);
                break;
            case "m":
                currentDate.setMinutes(currentDate.getMinutes() + amount);
                break;
            case "h":
                currentDate.setHours(currentDate.getHours() + amount);
                break;
            case "ml":
                currentDate.setMilliseconds(currentDate.getMilliseconds() + amount);
                break;
            default:
                throw new Error("Invalid unit");
        }
        return currentDate;
    }
    generateCronExpression(date, second) {
        // Extract month, day, hour, and minute components
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        // Format components into a cron job expression
        if (second === true) {
            return `${seconds} ${minute} ${hour} ${day} ${month} *`;
        }
        return `${minute} ${hour} ${day} ${month} *`;
    }
};
UtilityFunctionService = __decorate([
    (0, common_1.Injectable)()
], UtilityFunctionService);
exports.UtilityFunctionService = UtilityFunctionService;
