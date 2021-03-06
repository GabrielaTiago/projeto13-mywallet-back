import joi from "joi";

export const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(4)
});

export const signUpSchema = joi.object({
    name: joi.string().required().min(1),
    email: joi.string().email().required(),
    password: joi.string().required().min(4),
    confirmPassword: joi.ref('password')
});

export const transactionsSchema = joi.object({
    amout: joi.string().required().min(1),
    description : joi.string().required().min(2),
    status: joi.string()
});