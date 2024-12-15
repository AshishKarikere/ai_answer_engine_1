// TODO: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
// Refer to the Next.js Docs on how to read the Request body: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Refer to the Groq SDK here on how to use an LLM: https://www.npmjs.com/package/groq-sdk
// Refer to the Cheerio docs here on how to parse HTML: https://cheerio.js.org/docs/basics/loading
// Refer to Puppeteer docs here: https://pptr.dev/guides/what-is-puppeteer
import { NextResponse } from "next/server";
import { getGroqResponse } from "@/app/utils/groqClient";
import { scrapeUrl, urlPattern } from "@/app/utils/scraper";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    console.log("message received:", message);

    const url = message.match(urlPattern);
    if (url) {
      console.log("Url found", url);

      const scrapedContent = await scrapeUrl(url[0]);

      console.log("Scraped Content", scrapedContent);
    }

    const response = await getGroqResponse(message);

    //console.log("response recorded:", response);

    return NextResponse.json({ message: response });
  } catch (error) {
    return NextResponse.json({ message: "Error" });
  }
}
