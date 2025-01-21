import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt'
import { Contact, User } from "@prisma/client";

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) { }

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test_username'
            }
        })
    }

    async deleteContact() {
        await this.prismaService.contact.deleteMany({
            where: {
                username: 'test_username'
            }
        })
    }

    async getUser(): Promise<User> {
        return await this.prismaService.user.findUnique({
            where: {
                username: 'test_username'
            }
        })
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: 'test_username',
                name: 'test_name',
                password: await bcrypt.hash('test_password', 10),
                token: 'test_token'
            }
        })
    }

    async getContact() : Promise<Contact> {
        return await this.prismaService.contact.findFirst({
            where: {
                username: 'test_username'
            }
        })
    }

    async createContact() {
        await this.prismaService.contact.create({
            data: {
                first_name: "test",
                last_name: "test",
                email: "test@test.com",
                phone: "0123456789",
                username: 'test_username'
            }
        })
    }
}