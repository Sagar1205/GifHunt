import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import dotenv from "dotenv"
dotenv.config()

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined) {
                if (!credentials || !credentials.email || !credentials.password) {
                    console.error("Invalid credentials");
                    return null;
                }

                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        credentials.email,
                        credentials.password
                    );

                    if (userCredential.user) {
                        return {
                            id: userCredential.user.uid,
                            email: userCredential.user.email,
                        };
                    }
                    
                    return null;
                } catch (error) {
                    console.error("Error signing in:", error);
                    return null;
                }
            },
        }),
    ],
};

export default NextAuth(authOptions);
