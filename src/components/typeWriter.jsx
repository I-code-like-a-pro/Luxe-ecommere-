import React, { useEffect, useState } from 'react'

export default function TypewriterEffect({ text = '', speed = 40 }) {
    const [displayedText, setDisplayedText] = useState('')
    const [index, setIndex] = useState(0)

    useEffect(() => {
        // reset when text changes
        setDisplayedText('')
        setIndex(0)
    }, [text])

    useEffect(() => {
        if (!text || index >= text.length) return

        const id = setTimeout(() => {
            setDisplayedText((prev) => prev + text[index])
            setIndex((i) => i + 1)
        }, speed)

        return () => clearTimeout(id)
    }, [index, text, speed])

    return <span className="typewriter-text">{displayedText}</span>
}