import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class TiposService{
    constructor(private prisma:PrismaService){}

}