import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { AnalyzeProductReviews } from './CallGroq.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/api/analyze-reviews', async (req, res) => {
  const { reviews } = req.body
  if (!Array.isArray(reviews)) {
    return res.status(400).json({ error: 'reviews must be an array' })
  }

  try {
    const result = await AnalyzeProductReviews(reviews)
    res.json(result)
  } catch (err) {
    console.error('Analyze error', err)
    res.status(500).json({ error: 'analysis_failed' })
  }
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => console.log(`Analysis server listening on ${PORT}`))
