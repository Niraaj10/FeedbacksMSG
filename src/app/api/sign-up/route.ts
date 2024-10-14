import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from '@/helpers/sendVerificationEmails'

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, password, email } = await request.json()

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 400 }
            );
        }

        const existingUSerByEmail = await UserModel.findOne({ email })

        if (existingUSerByEmail) {
            if (existingUSerByEmail.isVerified) {
                return Response.json(
                  {
                    success: false,
                    message: 'User already exists with this email',
                  },
                  { status: 400 }
                );
              } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUSerByEmail.password = hashedPassword;
                existingUSerByEmail.verifyCode = verifyCode;
                existingUSerByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUSerByEmail.save();
              }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMSG: true,
                messages: []
            })

            await newUser.save()
        }

        //Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            },
                { status: 500 }
            )
        }

        return Response.json({
            success: true,
            message: 'User registered successfully. Please verify your account.',
        },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
}