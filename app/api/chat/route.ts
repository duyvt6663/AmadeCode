import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'
import { StringOutputParser } from "@langchain/core/output_parsers";

// export const runtime = 'edge'
export async function POST(req: Request) {
	const model = new ChatGroq({
		apiKey: process.env.GROQ_API_KEY,
		temperature: 0,
		modelName: 'llama2-70b-4096',
	})
	const prompt = ChatPromptTemplate.fromMessages([
		["system", "You are a master of programing. You are to assist me in solving a coding problem. I will code and you will construct a sub-goals hierarchy based on my code."],
		["human", "{input}"],
		]);
	const outputStringParser = new StringOutputParser();
	const chain = prompt.pipe(model).pipe(outputStringParser);
	
	try {
		const { messages } = await req.json()
		const response = await chain.stream({
			input: messages[messages.length - 1].content
		})
		return new StreamingTextResponse(response)
	} catch (error: any) {
		return new NextResponse(error.message || 'Something went wrong!', {
			status: 500
		})
	}
}