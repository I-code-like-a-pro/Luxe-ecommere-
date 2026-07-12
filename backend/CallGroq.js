import process from 'process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env')

if (!process.env.VITE_GROQ_API_KEY && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        let val = match[2].trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        process.env[key] = val
      }
    }
  })
}

const apiKey = process.env.VITE_GROQ_API_KEY
const MODEL = 'llama-3.3-70b-versatile'

const INSIGHT_MAP = {
  // Positives
  'comfortable and stylish': 'Highly comfortable & stylish',
  'wear them every day': 'Durable for daily use',
  'still look new': 'Durable build quality',
  'great fit and lightweight': 'Lightweight with a great fit',
  'perfect for everyday wear': 'Ideal for daily use',
  'easy to dress up or down': 'Versatile style',
  'leather is soft': 'Soft, premium leather',
  'strap is very comfortable': 'Comfortable strap design',
  'get compliments every time': 'Eye-catching design',
  'beautiful finish': 'Beautiful aesthetic',
  'very functional': 'Highly functional design',
  'excellent quality': 'Excellent build quality',
  'perfect size': 'Perfect daily capacity',
  'soft linen': 'Soft linen fabric',
  'nice loose fit': 'Relaxed, loose fit',
  'great for warm weather': 'Perfect for warm weather',
  'looks much more expensive': 'Premium look & feel',
  'beautiful shine': 'Beautiful shine & finish',
  'very lightweight': 'Lightweight feel',
  'without discomfort': 'Comfortable for all-day wear',
  'lovely hoops': 'Elegant hoop design',
  'perfect accessory': 'Highly versatile accessory',
  'fits true to size': 'Accurate sizing',
  'comfortable all day': 'All-day comfort',
  'nice cut': 'Flattering cut',
  'look sharp': 'Sharp aesthetic',
  'feel relaxed': 'Relaxed fit',
  'sleek design': 'Sleek minimalist design',
  'movement is very accurate': 'Accurate timekeeping',
  'strap feels premium': 'Premium leather strap',
  'keeps perfect time': 'Highly reliable movement',
  'great size': 'Spacious capacity',
  'sturdy straps': 'Sturdy carrying straps',
  'roomy interior': 'Spacious interior',
  'easy to carry': 'Easy & lightweight to carry',
  'holds everything': 'Excellent storage capacity',
  'beautiful boots': 'Stylish boot design',
  'great fit': 'Great fit & shape',
  'comfortable from the first wear': 'No break-in period required',
  'excellent craftsmanship': 'Excellent craftsmanship',
  'very stylish': 'Highly stylish look',

  // Negatives
  'sole had just a touch more grip': 'Sole lacks grip',
  'wish the sole had': 'Sole could be grippier',
  'one more interior pocket': 'Lacks additional interior pockets',
  'wrinkle a bit': 'Fabric wrinkles easily',
  'slightly thicker finish': 'Finish could be thicker',
  'more size choices': 'Limited size selection',
  'bigger face': 'Watch face is on the smaller side',
  'color fades': 'Color fades after washing',
  'size up': 'May need to size up',
}

const POSITIVE_ADJECTIVES = ['great', 'good', 'excellent', 'beautiful', 'perfect', 'sturdy', 'soft', 'comfortable', 'lovely', 'fast', 'clear', 'amazing', 'nice', 'friendly', 'premium', 'high-quality', 'durable', 'sleek', 'roomy', 'spacious', 'sharp', 'accurate', 'smooth', 'flexible', 'vibrant', 'bright', 'quiet', 'reliable']
const NEGATIVE_ADJECTIVES = ['bad', 'poor', 'slow', 'expensive', 'cheap', 'faded', 'wrinkled', 'small', 'tight', 'loose', 'large', 'heavy', 'thick', 'thin', 'noisy', 'weak', 'flimsy', 'rough', 'dull', 'laggy', 'uncomfortable', 'difficult', 'hard']
const NOUNS = ['leather', 'strap', 'finish', 'size', 'quality', 'fit', 'design', 'shipping', 'delivery', 'sound', 'packaging', 'fabric', 'look', 'style', 'service', 'price', 'value', 'material', 'battery', 'screen', 'performance', 'weight', 'color', 'grip', 'movement', 'timekeeping', 'craftsmanship', 'boot', 'sneaker', 'shirt', 'earring', 'chino', 'watch', 'bag', 'tote', 'sole', 'pocket', 'face', 'button', 'zipper', 'packaging', 'charging', 'speed']

function extractInsights(text, isPositive) {
  const adjs = isPositive ? POSITIVE_ADJECTIVES : NEGATIVE_ADJECTIVES
  const lower = text.toLowerCase()
  const foundInsights = []

  for (const adj of adjs) {
    if (lower.includes(adj)) {
      for (const noun of NOUNS) {
        if (lower.includes(noun)) {
          const formattedAdj = adj.charAt(0).toUpperCase() + adj.slice(1)
          const insight = `${formattedAdj} ${noun}`
          if (!foundInsights.includes(insight)) {
            foundInsights.push(insight)
          }
        }
      }
    }
  }
  return foundInsights
}

function fallbackAnalyze(reviews) {
  const pros = []
  const cons = []

  for (const review of reviews) {
    const text = typeof review === 'string' ? review : (review && typeof review.comment === 'string' ? review.comment : String(review))
    if (!text) continue
    
    const lowerText = text.toLowerCase()
    let matchedPro = false
    let matchedCon = false

    // 1. Try exact matches from map
    for (const [key, value] of Object.entries(INSIGHT_MAP)) {
      if (lowerText.includes(key)) {
        if (key.includes('wish') || key.includes('fade') || key.includes('wrinkle') || key.includes('size up') || key.includes('grip') || key.includes('pocket') || key.includes('size choices') || key.includes('bigger face')) {
          if (!cons.includes(value)) {
            cons.push(value)
            matchedCon = true
          }
        } else {
          if (!pros.includes(value)) {
            pros.push(value)
            matchedPro = true
          }
        }
      }
    }

    // 2. Try dynamic extraction
    const sentences = text.split(/[,.;]|\bbut\b|\bthough\b/i)
    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      if (!trimmed) continue

      if (!matchedPro) {
        const dynamicPros = extractInsights(trimmed, true)
        for (const dp of dynamicPros) {
          if (!pros.includes(dp)) {
            pros.push(dp)
            matchedPro = true
          }
        }
      }

      if (!matchedCon) {
        const dynamicCons = extractInsights(trimmed, false)
        for (const dc of dynamicCons) {
          if (!cons.includes(dc)) {
            cons.push(dc)
            matchedCon = true
          }
        }
      }
    }

    // 3. Fallback heuristic matching
    if (!matchedPro || !matchedCon) {
      for (const sentence of sentences) {
        const trimmed = sentence.trim()
        if (!trimmed) continue
        const lower = trimmed.toLowerCase()
        
        if (!matchedPro) {
          if (lower.includes('great') || lower.includes('comfortable') || lower.includes('stylish') || lower.includes('love') || lower.includes('perfect') || lower.includes('excellent') || lower.includes('beautiful') || lower.includes('easy') || lower.includes('sturdy') || lower.includes('premium') || lower.includes('nice')) {
            let clean = 'Good quality'
            if (lower.includes('comfort')) clean = 'Comfortable design'
            else if (lower.includes('style') || lower.includes('look')) clean = 'Stylish aesthetic'
            else if (lower.includes('fit')) clean = 'Great fit'
            else if (lower.includes('easy')) clean = 'User-friendly & convenient'
            else if (lower.includes('sturdy') || lower.includes('durable')) clean = 'Sturdy & durable build'
            else if (lower.includes('service')) clean = 'Great service'
            else if (lower.includes('deliver') || lower.includes('ship')) clean = 'Fast shipping'
            
            if (!pros.includes(clean)) {
              pros.push(clean)
              matchedPro = true
            }
          }
        }

        if (!matchedCon) {
          if (lower.includes('wish') || lower.includes('expensive') || lower.includes('small') || lower.includes('large') || lower.includes('bad') || lower.includes('fades') || lower.includes('slow') || lower.includes('poor')) {
            let clean = 'Minor usability issues'
            if (lower.includes('expensive') || lower.includes('price')) clean = 'Premium pricing'
            else if (lower.includes('small') || lower.includes('tight')) clean = 'Sizing runs small'
            else if (lower.includes('large') || lower.includes('loose')) clean = 'Sizing runs large'
            else if (lower.includes('fade')) clean = 'Material may fade'
            else if (lower.includes('slow') && (lower.includes('shipping') || lower.includes('deliver') || lower.includes('arrive'))) clean = 'Slow shipping'
            else if (lower.includes('slow')) clean = 'Slow performance'
            else if (lower.includes('quality') || lower.includes('flimsy')) clean = 'Build quality could be improved'
            
            if (!cons.includes(clean)) {
              cons.push(clean)
              matchedCon = true
            }
          }
        }
      }
    }
  }

  const finalPros = pros.slice(0, 3)
  const finalCons = cons.slice(0, 3)

  if (finalPros.length === 0 && reviews.length > 0) {
    finalPros.push("Good overall quality")
  }
  if (finalCons.length === 0 && reviews.length > 0) {
    finalCons.push("None reported")
  }

  return { pros: finalPros, cons: finalCons }
}

export async function AnalyzeProductReviews(reviews) {
  if (!Array.isArray(reviews)) {
    throw new Error('Reviews must be an array')
  }

  if (reviews.length === 0) {
    return { pros: [], cons: [] }
  }

  try {
    if (!apiKey) {
      throw new Error('Missing OpenAI API key')
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
  } catch (err) {
    console.error('Groq analysis failed, using fallback:', err.message)
    return fallbackAnalyze(reviews)
  }
}