import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import axios from "axios";
import { UserType } from "../../enums";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService
  ) {}

  async getChild(childId: string): Promise<any> {
    const response = await axios.get(
      `${this.configService.getOrThrow(
        "AUTH_SERVICE"
      )}/child/get_child_auth?childId=${childId}`
    );

    return response.data;
  }

  async getUser(userId: string): Promise<any> {
    const response = await axios.get(
      `${this.configService.getOrThrow(
        "AUTH_SERVICE"
      )}/user/find-user-for-auth?userId=${userId}`
    );
    return response.data;
  }

  async getChildForPreschool(
    childId: string,
    preschoolId: string
  ): Promise<any> {
    const response = await axios.get(
      `${this.configService.getOrThrow(
        "AUTH_SERVICE"
      )}/child/get_child_prescool_auth?childId=${childId}&preschoolId=${preschoolId}`
    );
    return response.data;
  }

  async getClinicDetails(clinicId: string, docId: string): Promise<any> {
    const response = await axios.get(
      `${this.configService.getOrThrow(
        "AUTH_SERVICE"
      )}/user/get_clinic_details_auth?clinicId=${clinicId}&docId=${docId}`
    );

    return response.data;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // fetching roles value via @Roles() decorator
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    const isNew = this.reflector.get<boolean>("isNew", context.getHandler());
    const { user, query, body } = context.switchToHttp().getRequest();

    // matching decorator values with accessToken(userType) value
    if (roles?.includes(user?.userType) || roles === undefined) {
      // check validation for PARENT user
      if (
        roles?.includes(UserType.PARENT) &&
        user?.userType === UserType.PARENT
      ) {
        if (query?.childId || query?.childID || body?.childID) {
          const child = await this.getChild(
            query.childId || query?.childID || body?.childID
          );
          if (
            child?.motherInfo?.parentId === user?.userId ||
            child?.fatherInfo?.parentId === user?.userId
          ) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }
        if (query?.parentId) {
          if (query?.parentId === user.userId) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }
        if (query?.userId) {
          if (query?.userId === user.userId) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }
        return true;
      }
      // check validation for PRESCHOOL user
      if (
        roles?.includes(UserType.PRESCHOOL) &&
        user?.userType === UserType.PRESCHOOL
      ) {
        if (
          (query?.childID && query?.centerId) ||
          (body?.childID && body?.centerId)
        ) {
          const child = await this.getChildForPreschool(
            query.childID || body?.childID,
            user?.userId
          );
          if (child) {
            return true;
          } else if (isNew) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }
        if (query?.preschoolId || body?.preschoolId) {
          if (
            query.preschoolId === user.userId ||
            body?.preschoolId === user.userId
          ) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission ghfghfgh!");
        }
        if ((query?.centerId || body.centerId) && !query.childID) {
          if (query.centerId === user.userId || body.centerId === user.userId) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }
        if (body?.childId || query?.childId) {
          const child = await this.getChildForPreschool(
            body?.childId || query?.childId,
            user?.userId
          );
          if (child) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }
      }

      // check validation for clinic user
      if (
        roles?.includes(UserType.CLINIC) &&
        user?.userType === UserType.CLINIC
      ) {
        if (body?.childId || query?.childId) {
          const child = (
            await this.getChild(body?.childId || query?.childId)
          )?.clinicInfo?.find(
            (val: { id: string }) => val?.id === user?.userId
          );
          if (child) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }

        if (query?.docId) {
          const clinic = await this.getClinicDetails(user.userId, query?.docId);
          if (clinic) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }
      }

      // check validation for doctor user
      if (
        roles?.includes(UserType.DOCTOR) &&
        user?.userType === UserType.DOCTOR
      ) {
        if (body?.childId) {
          const child = (await this.getChild(body?.childId))?.doctorInfo?.find(
            (val: { id: string }) => val?.id === user?.userId
          );
          if (child) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }
      }

      // check validation for teacher user
      if (
        roles?.includes(UserType.TEACHER) &&
        user?.userType === UserType.TEACHER
      ) {
        /*
          Validation Logic 1 :
            - if the preschool Id has been sent via the query then directly check if the preschool is common for teacher and child
        */
        if (
          body?.childId ||
          query?.childId ||
          query?.childID ||
          body?.childID
        ) {
          if (
            query?.centerId ||
            query?.centerID ||
            body?.centerID ||
            body?.centerId
          ) {
            const child = await this.getChildForPreschool(
              body?.childId || query?.childId || query.childID || body?.childID,
              query?.centerId ||
                query?.centerID ||
                body?.centerID ||
                body?.centerId
            );
            if (!child) {
              throw new ForbiddenException("Insufficient Permission!");
            }
            const teacher = (
              await this.getUser(user.userId)
            )?.preschoolDetails.find(
              (val: { preschoolId: string }) =>
                val.preschoolId ===
                (query?.centerId ||
                  query?.centerID ||
                  body?.centerID ||
                  body?.centerId)
            );
            if (!teacher) {
              throw new ForbiddenException("Insufficient Permission!");
            }
            return true;
          }
          /*
            Validation Logic 2 :
              - if there exists a preschool where a child is registered and also the teacher is also registered then return true
          */
          const child = await this.getChild(
            body?.childId || query?.childId || query.childID || body?.childID
          );
          const teacher = await this.getUser(user.userId);
          if (this.checkCommonPreschoolInUserAndChild(teacher, child)) {
            return true;
          }
          throw new ForbiddenException("Insufficient Permission!");
        }
      }

      return true;
    }
    return false;
  }

  /* Checks if there is any common preschool among the teacher and the child for verification purposes */
  checkCommonPreschoolInUserAndChild(user: any, child: any): boolean {
    let isCommon = false;
    user.preschoolDetails.forEach((teacherPreschool: { preschoolId: string }) =>
      child.preSchoolInfo.forEach((childPreschool: { id: string }) => {
        if (teacherPreschool.preschoolId === childPreschool.id) {
          isCommon = true;
          return true;
        }
      })
    );
    return isCommon;
  }
}
