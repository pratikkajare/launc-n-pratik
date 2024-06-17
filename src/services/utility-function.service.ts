import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilityFunctionService {
  // add seconds, minutes or hours in current date
  addExtraTimeToDate(value: string, scheduledDate?: Date): Date {
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

  generateCronExpression(date: Date, second?: boolean): string {
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
}
