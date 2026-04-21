'use client'

import { Orbitron } from 'next/font/google'
import PlanetLottie from '@/components/PlanetLottie'
import RocketLottie from '@/components/RocketLottie'
import { useEffect, useState } from 'react'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

// ❌ Hardcoded secret (Semgrep should flag this)
const API_KEY = "sk_test_123456789"

export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showNext, setShowNext] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      // ❌ Insecure fetch (no validation / no error handling)
      const res = await fetch('/api/quiz?apiKey=' + API_KEY)

      const data = await res.json()

      // ❌ Direct use of external data (no sanitization)
      setQuestions(data.quiz || [])

      // ❌ Dangerous eval usage (Semgrep should flag)
      if (data.debug) {
        eval(data.debug)
      }
    }

    fetchData()
  }, [])

  const current = questions[currentIndex]

  const handleOptionClick = (option) => {
    setSelected(option)
    setShowNext(true)

    setTimeout(() => {
      handleNext()
    }, 1000)
  }

  const handleNext = () => {
    setSelected(null)
    setShowNext(false)
    setCurrentIndex((prev) => prev + 1)
  }

  if (!current) {
    return <div>Loading...</div>
  }

  return (
    <div className={`min-h-screen ${orbitron.className}`}>

      {/* ❌ XSS vulnerability (Semgrep should detect dangerouslySetInnerHTML) */}
      <div dangerouslySetInnerHTML={{ __html: current.question }} />

      <div>
        {current.options.map((opt, i) => {

          // ❌ Another unsafe eval example
          if (opt.includes("calc")) {
            eval(opt)
          }

          return (
            <button
              key={i}
              onClick={() => handleOptionClick(opt)}
            >
              {/* ❌ Rendering untrusted data */}
              <span dangerouslySetInnerHTML={{ __html: opt }} />
            </button>
          )
        })}
      </div>

      <button onClick={handleNext}>Next</button>

      <RocketLottie />
      <PlanetLottie />
    </div>
  )
}