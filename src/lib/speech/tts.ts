let activeUtterances: SpeechSynthesisUtterance[] = []

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'
}

export function getFrenchVoice(): Promise<SpeechSynthesisVoice | null> {
  if (!isTtsSupported()) return Promise.resolve(null)
  const synth = window.speechSynthesis
  const choose = () => {
    try {
      const voices = synth.getVoices()
      return voices.find((voice) => voice.lang.toLowerCase() === 'fr-fr') ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('fr-')) ?? null
    } catch { return null }
  }
  const immediate = choose()
  if (immediate) return Promise.resolve(immediate)
  return new Promise<SpeechSynthesisVoice | null>((resolve) => {
    let finished = false
    const done = () => {
      if (finished) return
      finished = true
      synth.removeEventListener('voiceschanged', changed)
      window.clearTimeout(timeout)
      resolve(choose())
    }
    const changed = () => done()
    const timeout = window.setTimeout(done, 1500)
    synth.addEventListener('voiceschanged', changed)
  }).catch(() => null)
}

function splitForSpeech(text: string): string[] {
  const chunks: string[] = []
  for (const sentence of text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) ?? [text]) {
    let rest = sentence.trim()
    while (rest.length > 200) {
      let cut = rest.lastIndexOf(' ', 200)
      if (cut < 80) cut = 200
      chunks.push(rest.slice(0, cut).trim())
      rest = rest.slice(cut).trim()
    }
    if (rest) chunks.push(rest)
  }
  return chunks
}

/** Appelez speak depuis un geste utilisateur (ex. clic/tap) : Safari peut bloquer l'audio sinon. */
export function speak(text: string, options: { rate?: number; onEnd?: () => void } = {}): { cancel(): void } {
  let cancelled = false
  try {
    if (!isTtsSupported()) { options.onEnd?.(); return { cancel() {} } }
    stopSpeaking()
    const chunks = splitForSpeech(text)
    activeUtterances = chunks.map((chunk) => {
      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.lang = 'fr-FR'
      if (options.rate !== undefined) utterance.rate = options.rate
      return utterance
    })
    const utterances = activeUtterances
    let index = 0
    const queue = () => {
      if (cancelled || index >= utterances.length) {
        activeUtterances = []
        if (!cancelled) { try { options.onEnd?.() } catch { /* ignore consumer callback */ } }
        return
      }
      const utterance = utterances[index++]
      utterance.onend = queue
      utterance.onerror = queue
      try { utterance.voice = chooseVoiceNow() } catch { /* use fr-FR language fallback */ }
      try { window.speechSynthesis.speak(utterance) } catch { queue() }
    }
    queue()
  } catch { try { options.onEnd?.() } catch { /* no unhandled exceptions */ } }
  return { cancel() { cancelled = true; stopSpeaking() } }
}

function chooseVoiceNow(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices()
    return voices.find((voice) => voice.lang.toLowerCase() === 'fr-fr') ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('fr-')) ?? null
  } catch { return null }
}

export function stopSpeaking(): void {
  try { if (isTtsSupported()) window.speechSynthesis.cancel() } catch { /* browser API may fail */ }
  activeUtterances = []
}
