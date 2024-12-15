import axios from "axios";
import * as cheerio from "cheerio";

export const urlPattern =
  /(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6})([\/\w\.-]*)*\/?/g;

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\n+/g, "").trim();
}

export async function scrapeUrl(url: string) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    $("script").remove();
    $("style").remove();
    $("noscript").remove();
    $("iframe").remove();
    $("img").remove();
    $("video").remove();
    $("audio").remove();
    $("form").remove();
    $("button").remove();

    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const h1 = $("h1")
      .map((i, el) => $(el).text())
      .get()
      .join(" ");
    const h2 = $("h2")
      .map((i, el) => $(el).text())
      .get()
      .join(" ");

    const articleText = $("article")
      .map((i, el) => $(el).text())
      .get()
      .join(" ");
    const mainText = $("main")
      .map((i, el) => $(el).text())
      .get()
      .join(" ");

    const contentText = $('.content, #content, [class*="content"]')
      .map((i, el) => $(el).text())
      .get()
      .join(" ");

    const paragraphText = $("p")
      .map((i, el) => $(el).text())
      .get()
      .join(" ");
    const listText = $("li")
      .map((i, el) => $(el).text())
      .get()
      .join(" ");

    let combinedText = [
      title,
      metaDescription,
      h1,
      h2,
      articleText,
      mainText,
      contentText,
      paragraphText,
      listText,
    ].join(" ");

    combinedText = cleanText(combinedText).slice(0, 10000);

    return {
      url,
      title: cleanText(title),
      headings: {
        h1: cleanText(h1),
        h2: cleanText(h2),
      },
      metaDescription: cleanText(metaDescription),
      content: combinedText,
      error: null,
    };
  } catch (error) {
    console.error("Error scraping $(url):", error);
    return {
      url,
      title: "",
      headings: {
        h1: "",
        h2: "",
      },
      metaDescription: "",
      content: "",
      error: "Failed to scrape URL",
    };
  }

  //   console.log("response.data", response.data);
  //   //const title = $("title").text();
  //   console.log($);
}
function remove() {
  throw new Error("Function not implemented.");
}
