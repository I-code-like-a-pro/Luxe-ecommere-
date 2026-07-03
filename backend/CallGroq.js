const apiKey = import.meta.env.VITE_GROQ_API_KEY
const MODEL = 'llama-3.3-70b-versatile'

export async function AnalyzeProductReviews(reviews) {
  if (!Array.isArray(reviews)) {
    throw new Error('Reviews must be an array')
  }

  if (reviews.length === 0) {
    return { pros: [], cons: [] }
  }

  const formattedReviews = reviews
    .map((review, index) => {
      const comment =
        typeof review === 'string'
          ? review
          : review && typeof review.comment === 'string'
          ? review.comment
          : String(review)
      return `Review ${index + 1}: ${comment}`
    })
    .join('\n\n')

  if (!apiKey) {
    throw new Error('Missing OpenAI API key')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert product analyst. Analyze the provided customer reviews and extract a summarized list of pros and cons. You must respond ONLY with a valid JSON object matching this schema: { "pros": ["string"], "cons": ["string"] }. Do not include any introductory text or closing markdown.`,
        },
        { role: 'user', content: formattedReviews },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq Error ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  return typeof content === 'string' ? JSON.parse(content) : content


    
}