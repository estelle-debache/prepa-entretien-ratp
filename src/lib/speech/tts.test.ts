import { afterEach, describe, expect, it, vi } from 'vitest'
import { speak, stopSpeaking } from './tts'

class MockUtterance {
  readonly text: string
  lang = ''
  rate = 1
  voice: SpeechSynthesisVoice | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor(text: string) { this.text = text }
}

class MockSynthesis {
  speaking = false
  pending = false
  utterances: MockUtterance[] = []
  current: MockUtterance | null = null
  getVoices() { return [] }
  addEventListener() {}
  removeEventListener() {}
  speak(utterance: MockUtterance) {
    this.utterances.push(utterance)
    this.current = utterance
    this.speaking = true
  }
  cancel() {
    const cancelled = this.current
    this.current = null
    this.speaking = false
    this.pending = false
    cancelled?.onend?.()
  }
  finish() {
    const finished = this.current
    this.current = null
    this.speaking = false
    finished?.onend?.()
  }
}

const originalWindow = globalThis.window
const originalUtterance = globalThis.SpeechSynthesisUtterance
let synth: MockSynthesis

afterEach(() => {
  stopSpeaking()
  vi.useRealTimers()
  if (originalWindow) globalThis.window = originalWindow
  else Reflect.deleteProperty(globalThis, 'window')
  if (originalUtterance) globalThis.SpeechSynthesisUtterance = originalUtterance
  else Reflect.deleteProperty(globalThis, 'SpeechSynthesisUtterance')
})

function installFakeSpeech() {
  synth = new MockSynthesis()
  const fakeWindow = { speechSynthesis: synth, setTimeout: globalThis.setTimeout } as unknown as Window & typeof globalThis
  globalThis.window = fakeWindow
  globalThis.SpeechSynthesisUtterance = MockUtterance as unknown as typeof SpeechSynthesisUtterance
}

describe('speech synthesis queue', () => {
  it('stops after the first phrase and calls onEnd once', () => {
    installFakeSpeech()
    const onEnd = vi.fn()
    speak('Première phrase. Deuxième phrase.', { onEnd })
    expect(synth.utterances.map((utterance) => utterance.text)).toEqual(['Première phrase.'])
    stopSpeaking()
    expect(synth.utterances).toHaveLength(1)
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('replaces the previous queue without interleaving phrases', () => {
    vi.useFakeTimers()
    installFakeSpeech()
    const oldEnd = vi.fn()
    const newEnd = vi.fn()
    speak('Ancienne première. Ancienne suivante.', { onEnd: oldEnd })
    speak('Nouvelle phrase.', { onEnd: newEnd })
    expect(synth.utterances.map((utterance) => utterance.text)).toEqual(['Ancienne première.'])
    expect(oldEnd).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(150)
    expect(synth.utterances.map((utterance) => utterance.text)).toEqual(['Ancienne première.', 'Nouvelle phrase.'])
    synth.finish()
    expect(newEnd).toHaveBeenCalledTimes(1)
  })
})
