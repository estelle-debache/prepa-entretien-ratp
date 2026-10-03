let activeUtterances: SpeechSynthesisUtterance[] = []
let generation = 0

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'
}

export function primeVoices(): void {
  try { if (isTtsSupported()) window.speechSynthesis.getVoices() } catch { /* browser API may fail */ }
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
  const myGen = ++generation
  let ended = false
  const endOnce = () => {
    if (ended) return
    ended = true
    try { options.onEnd?.() } catch { /* ignore consumer callback */ }
  }
  try {
    if (!isTtsSupported()) { endOnce(); return { cancel() {} } }
    const synth = window.speechSynthesis
    const mustWaitAfterCancel = synth.speaking || synth.pending
    if (mustWaitAfterCancel) {
      try { synth.cancel() } catch { /* browser API may fail */ }
    }
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
      if (myGen !== generation) { endOnce(); return }
      if (index >= utterances.length) {
        activeUtterances = []
        endOnce()
        return
      }
      const utterance = utterances[index++]
      utterance.onend = queue
      utterance.onerror = queue
      try { utterance.voice = chooseVoiceNow() } catch { /* use fr-FR language fallback */ }
      try { synth.speak(utterance) } catch { queue() }
    }
    if (mustWaitAfterCancel) window.setTimeout(queue, 150)
    else queue()
  } catch { endOnce() }
  return { cancel() { if (myGen === generation) stopSpeaking() } }
}

function chooseVoiceNow(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices()
    return voices.find((voice) => voice.lang.toLowerCase() === 'fr-fr') ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('fr-')) ?? null
  } catch { return null }
}

export function stopSpeaking(): void {
  generation++
  try { if (isTtsSupported()) window.speechSynthesis.cancel() } catch { /* browser API may fail */ }
  activeUtterances = []
}
