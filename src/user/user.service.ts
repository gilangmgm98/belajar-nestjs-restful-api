import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from "../model/user.model";
import { Logger } from 'winston'
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { User } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) { }
    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.debug(`Register New User : ${JSON.stringify(request)}`)
        const registerRequest: RegisterUserRequest = this.validationService.validate(
            UserValidation.REGISTER,
            request
        );

        const totalUserWithSameUname = await this.prismaService.user.count({
            where: {
                username: registerRequest.username
            }
        })

        if (totalUserWithSameUname != 0) {
            throw new HttpException('username already registered', 400)
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await this.prismaService.user.create({
            data: registerRequest
        })

        return {
            username: user.username,
            name: user.name,
            // token: 'Bearer'+ jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
        }
    }

    async login(request: LoginUserRequest): Promise<UserResponse> {
        this.logger.debug(`Login User : ${JSON.stringify(request)}`)
        const loginRequest: LoginUserRequest = this.validationService.validate(
            UserValidation.LOGIN,
            request
        );

        let user = await this.prismaService.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })

        if (!user) {
            throw new HttpException('username or password is wrong', 401)
        }

        const isValidPassword = await bcrypt.compare(loginRequest.password, user.password)
        if (!isValidPassword) {
            throw new HttpException('username or password is wrong', 401)
        }

        user = await this.prismaService.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        })

        return {
            username: user.username,
            name: user.name,
            token: user.token,
        }
    }

    async getUser(user: User): Promise<UserResponse> {
        return {
            username: user.username,
            name: user.name,
        }
    }

    async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        this.logger.debug(`UserService update : (${JSON.stringify(user)} , ${JSON.stringify(request)})`)

        const updateRequest: UpdateUserRequest = this.validationService.validate(
            UserValidation.UPDATE,
            request
        )

        if(updateRequest.name){
            user.name = updateRequest.name
        }

        if(updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10)
        }

        const result = await this.prismaService.user.update({
            where: {
                username: user.username
            },
            data: user
        });

        return {
            username : result.username,
            name : result.name,
        }
    }

    async logOut(user : User) : Promise<UserResponse> {
        const result = await this.prismaService.user.update({
            where: {
                username: user.username
            },
            data: {
                token: null
            }
        })

        return {
            username : result.username,
            name : result.name,
        }
    }
}