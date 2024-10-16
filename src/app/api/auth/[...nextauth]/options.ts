import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import UserModel from "@/model/User";



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'Email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {password: credentials.identifier}
                        ]
                    })

                    if (!user) {
                        throw new Error('No user found with this email')
                    }
                    
                    if (!user.isVerified) {
                        throw new Error('Please verify your account first then try to login again')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)

                    if(isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error('Invalid password')
                    }

                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],

    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/sign-in',
    }

    
}