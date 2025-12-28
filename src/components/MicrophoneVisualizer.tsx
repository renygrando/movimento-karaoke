import { useEffect, useRef, useState } from 'react'
import { useKaraoke } from '@/contexts/KaraokeContext'
import { Button } from '@/components/ui/button'
import { Microphone, MicrophoneSlash } from '@phosphor-icons/react'

export function MicrophoneVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const { isMicActive, setIsMicActive } = useKaraoke()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('')

  const stopMicrophone = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setIsMicActive(false)
  }

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 128
      source.connect(analyser)
      
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      dataArrayRef.current = dataArray
      
      setIsMicActive(true)
      setHasPermission(true)
      setError('')
    } catch (err) {
      console.error('Microphone access denied:', err)
      setHasPermission(false)
      setError('Microphone access denied')
      setIsMicActive(false)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isMicActive || !analyserRef.current || !dataArrayRef.current) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current
    const bufferLength = dataArray.length

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>)

      const width = canvas.width
      const height = canvas.height

      ctx.fillStyle = 'oklch(0.15 0.05 285)'
      ctx.fillRect(0, 0, width, height)

      const barWidth = (width / bufferLength) * 2
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.8
        
        const hue = 210 + (i / bufferLength) * 140
        const intensity = dataArray[i] / 255
        const lightness = 0.5 + intensity * 0.3
        
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height)
        gradient.addColorStop(0, `oklch(${lightness} 0.15 ${hue})`)
        gradient.addColorStop(1, `oklch(${lightness * 0.7} 0.20 ${hue + 20})`)
        
        ctx.fillStyle = gradient
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight)

        x += barWidth
      }
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMicActive])

  useEffect(() => {
    return () => {
      stopMicrophone()
    }
  }, [])

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={120}
        className="w-full h-[120px] rounded-lg"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {!isMicActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90 backdrop-blur-sm rounded-lg">
          {hasPermission === false ? (
            <>
              <MicrophoneSlash size={32} className="text-destructive" />
              <p className="text-sm text-destructive font-['Exo_2']">{error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={startMicrophone}
                className="gap-2"
              >
                <Microphone size={16} />
                Retry Access
              </Button>
            </>
          ) : (
            <>
              <Microphone size={32} className="text-primary" />
              <Button
                size="sm"
                onClick={startMicrophone}
                className="gap-2"
              >
                <Microphone size={16} />
                Enable Microphone
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
