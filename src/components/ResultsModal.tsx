import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Star, Confetti, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ResultsModalProps {
  open: boolean
  onClose: () => void
  score: number
  songTitle: string
  songArtist: string
}

const compliments = [
  'Uma nova estrela nasceu!',
  'A plateia está enlouquecida!',
  'Simplesmente incrível!',
  'Que apresentação espetacular!',
  'Você arrasou!',
  'De pé e aplaudindo!',
  'Talento de primeira!',
  'Pura genialidade!',
  'Bis! Bis! Bis!',
  'Performance lendária!',
  'Mandou muito bem!',
  'Show de bola!',
  'Perfeito demais!',
]

function getStarRating(score: number): number {
  if (score >= 9000) return 5
  if (score >= 7000) return 4
  if (score >= 5000) return 3
  if (score >= 3000) return 2
  return 1
}

export function ResultsModal({ open, onClose, score, songTitle, songArtist }: ResultsModalProps) {
  const [stars, setStars] = useState(0)
  const [compliment, setCompliment] = useState('')

  useEffect(() => {
    if (open) {
      const rating = getStarRating(score)
      setStars(rating)
      setCompliment(compliments[Math.floor(Math.random() * compliments.length)])
    }
  }, [open, score])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Orbitron'] text-3xl uppercase tracking-wider text-center glow-text">
            🎉 Parabéns! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="flex items-center justify-center gap-2">
            <Confetti size={32} weight="fill" className="text-accent animate-bounce" />
            <Sparkle size={24} weight="fill" className="text-primary animate-pulse" />
            <Confetti size={32} weight="fill" className="text-accent animate-bounce delay-100" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-['Exo_2'] font-semibold text-xl text-foreground">
              {songTitle}
            </h3>
            <p className="font-['Exo_2'] text-sm text-muted-foreground">
              {songArtist}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                }}
              >
                <Star
                  size={40}
                  weight={index < stars ? 'fill' : 'regular'}
                  className={index < stars ? 'text-accent glow-accent' : 'text-muted-foreground'}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="font-['Exo_2'] text-sm text-muted-foreground uppercase tracking-wide">
                Sua Pontuação
              </div>
              <div className="font-['Orbitron'] text-6xl font-bold glow-text">
                {score.toLocaleString()}
              </div>
            </div>
            <p className="font-['Exo_2'] text-lg font-semibold text-accent glow-accent animate-pulse">
              {compliment}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-['Exo_2'] font-medium uppercase tracking-wide hover:shadow-[0_0_15px_rgba(0,245,255,0.5)]"
            >
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
