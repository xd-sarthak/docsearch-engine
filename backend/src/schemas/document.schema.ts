import {z} from "zod";

export const createDocumentSchema  = z.object({
    body : z.object({
        title: z.string().min(1,"Title is Required"),
        content: z.string().min(1,"Content is Required")
    })
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>["body"];
