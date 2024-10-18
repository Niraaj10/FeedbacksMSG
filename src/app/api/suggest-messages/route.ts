// import OpenAI from 'openai';
// // import { openai } from '@ai-sdk/openai';
// import { toDataStreamResponse } from 'ai';
// import { NextResponse } from 'next/server'

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });

// // console.log("API Key from environment:", process.env.OPENAI_API_KEY);

// export const maxDuration = 30;

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   try {


//     const promptMessage = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

//     const response = await openai.completions.create({
//         model: 'gpt-3.5-turbo-instruct',
//         max_tokens: 400,
//         stream: true,
//         promptMessage,
//       });

//       console.log(response);

//       // Convert the OpenAI stream to a data stream response
//       const streamResponse = toDataStreamResponse(response);

//       return streamResponse;


//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//         // OpenAI API error handling
//         const { name, status, headers, message } = error;
//         return NextResponse.json({ name, status, headers, message }, { status });
//       } else {
//         // General error handling
//         console.error('An unexpected error occurred:', error);
//         throw error;
//       }
//   }
// }





import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEYYY,
});

// console.log("API Key from environment:", process.env.OPENAI_API_KEYYY);

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 200,
            stream: true,
            prompt,
        });
        console.log(response)

        const stream = OpenAIStream(response);


        return new StreamingTextResponse(stream);

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            // OpenAI API error handling
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
            // General error handling
            console.error('An unexpected error occurred:', error);
            throw error;
        }
    }
}