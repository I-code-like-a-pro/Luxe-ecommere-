const apiKey = process.env.OPEN_AI_SECRET_KEY;
const MODEL = "llama-3.3-70b-versatile";


export async function AnalyzeProductReviews(reviews){
    if(typeof(reviews) == "array"){
        return "Invalid type"
    }
    if(reviews.length == 0 || !reviews){
        return []
    }
    const formattedReviews = reviews.map((review,index) => `Review${review.comment}, index${index}`).join("\n\n")

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {

        method: "POST",
        headers: {

            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" }, 
        messages: [
             {
            role: "system",
            content: `You are an expert product analyst. Analyze the provided customer reviews and extract a summarized list of pros and cons. You must respond ONLY with a valid JSON object matching this schema: { "pros": ["string"], "cons": ["string"] }. Do not include any introductory text or closing markdown.`
          },
          {
            role:"user",
            content:`${formattedReviews}`
          }
      ],
    }),
  });

  if(!response.ok){
    throw new Error(`Groq Error ${response.status} ${response.statusText}`)
  }
     const data = await response.json();
    return JSON.parse(data.choices[0].message.content);


    
}