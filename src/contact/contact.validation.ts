import { z, ZodType } from "zod";

export class ContactValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z.string().min(4).max(25),
        last_name: z.string().min(4).max(25).optional(),
        email: z.string().min(4).max(20).email().optional(),
        phone: z.string().min(10).max(20).optional(),
    })
    
    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        first_name: z.string().min(4).max(25),
        last_name: z.string().min(4).max(25).optional(),
        email: z.string().min(4).max(20).email().optional(),
        phone: z.string().min(10).max(20).optional(),    
    })

    static readonly SEARCH: ZodType = z.object({
        name: z.string().min(1).optional(),
        email: z.string().min(1).optional(),
        phone: z.string().min(1).optional(),    
        page: z.number().min(1).positive(),
        size: z.number().min(1).max(100).positive(),
    })

    
}