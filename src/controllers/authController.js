import bcrypt from "bcrypt";
import { singInSchema, signUpSchema} from "../schema/schemas.js"
import { db } from "../dbStrategy/mongodb.js";


async function signInUser(require, response) {
    const { email, password } = require.body;
    const validation = singInSchema.validate(require.body, { abortEarly: true });
    const user = await db.collection("users").findOne({ email });

    if (validation.error) {
        response.status(422).send(validation.error.details);
        return;
    }

    if (user && bcrypt.compareSync(password, user.password)) {
        response.status(200).send("Login successfully");
    }
    else {
        response.status(400).send("Incorrect email or password");
    }

    try {
        await db
            .collection("users")
            .insertOne({ email, password: user.password });

    } catch (error) {
        console.error(error);
        response.status(500).send("Bad request");
    }
};

async function signUpUser(require, response) {
    const signUp = require.body;
    const validation = signUpSchema.validate(signUp, { abortEarly: true });

    if (validation.error){
        response.status(422).send(validation.error.details);
        return;
    }

    try {
        const passwordHash = bcrypt.hashSync(signUp.password, 10);

        await db
            .collection("users")
            .insertOne({ ...signUp, password: passwordHash });

        response.status(201).send("Registered user");

    } catch (error) {
        console.error(error);
        response.status(500).send("Bad request");
    }
}

export { signInUser, signUpUser };