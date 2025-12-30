import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Confetti, Sparkle, Heart } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface ResultsModalProps {
  open: boolean;
  onClose: () => void;
  score: number;
  songTitle: string;
  songArtist: string;
}

// Mensagens de agradecimento personalizadas por faixa de nota
const thankYouMessages = {
  excellent: [
    "🌟 Obrigado por essa apresentação brilhante!",
    "✨ Você nos emocionou com sua voz!",
    "🎯 Perfeição em forma de música!",
    "💎 Uma performance verdadeiramente excepcional!",
    "🏆 Você foi absolutamente magnífico!",
  ],
  great: [
    "👏 Obrigado por esse show incrível!",
    "🎊 Você foi fantástico!",
    "⭐ Muito obrigado pela apresentação!",
    "🎵 Que talento você tem!",
    "🎉 Arrasou demais!",
  ],
  good: [
    "🙏 Obrigado por cantar com a gente!",
    "😊 Muito legal sua apresentação!",
    "👍 Você foi ótimo!",
    "🎤 Gostamos muito do seu desempenho!",
    "✨ Que momento especial!",
  ],
  decent: [
    "💪 Parabéns pelo esforço!",
    "🎵 Valeu por cantar!",
    "😄 Você foi legal!",
    "🌟 Próxima será ainda melhor!",
    "👏 Obrigado pela participação!",
  ],
};

const compliments = [
  "Uma nova estrela nasceu!",
  "A plateia está enlouquecida!",
  "Simplesmente incrível!",
  "Que apresentação espetacular!",
  "Você arrasou!",
  "De pé e aplaudindo!",
  "Talento de primeira!",
  "Pura genialidade!",
  "Bis! Bis! Bis!",
  "Performance lendária!",
  "Mandou muito bem!",
  "Show de bola!",
  "Perfeito demais!",
];

function generateRating(score: number): number {
  // Gera uma nota de 0-100, mas nunca menor que 50
  // Usa o score como base para influenciar a nota
  const scoreInfluence = Math.min(score / 100, 50); // Influência de até 50 pontos
  const randomBonus = Math.random() * 50; // Bônus aleatório de até 50
  const rating = Math.round(50 + scoreInfluence + randomBonus);
  return Math.min(rating, 100);
}

function getRatingCategory(
  rating: number
): "excellent" | "great" | "good" | "decent" {
  if (rating >= 90) return "excellent";
  if (rating >= 75) return "great";
  if (rating >= 60) return "good";
  return "decent";
}

function getThankYouMessage(rating: number): string {
  const category = getRatingCategory(rating);
  const messages = thankYouMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getStarRating(score: number): number {
  if (score >= 9000) return 5;
  if (score >= 7000) return 4;
  if (score >= 5000) return 3;
  if (score >= 3000) return 2;
  return 1;
}

export function ResultsModal({
  open,
  onClose,
  score,
  songTitle,
  songArtist,
}: ResultsModalProps) {
  console.log("\n🎭 ResultsModal RENDER - open:", open, "score:", score);
  
  const [stars, setStars] = useState(0);
  const [compliment, setCompliment] = useState("");
  const [rating, setRating] = useState(0);
  const [thankYouMessage, setThankYouMessage] = useState("");

  useEffect(() => {
    console.log("🎭 ResultsModal useEffect - open:", open);
    if (open) {
      console.log("✅ Modal aberto! Gerando dados...");
      const newRating = generateRating(score);
      setRating(newRating);

      const starRating = getStarRating(score);
      setStars(starRating);

      setCompliment(
        compliments[Math.floor(Math.random() * compliments.length)]
      );
      setThankYouMessage(getThankYouMessage(newRating));
      console.log("✅ Dados do modal gerados - Rating:", newRating);
    }
  }, [open, score]);

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
            <Confetti
              size={32}
              weight="fill"
              className="text-accent animate-bounce"
            />
            <Sparkle
              size={24}
              weight="fill"
              className="text-primary animate-pulse"
            />
            <Confetti
              size={32}
              weight="fill"
              className="text-accent animate-bounce delay-100"
            />
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-['Exo_2'] font-semibold text-xl text-foreground">
              {songTitle}
            </h3>
            <p className="font-['Exo_2'] text-sm text-muted-foreground">
              {songArtist}
            </p>
          </div>

          {/* Nota de 0-100 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
            className="text-center space-y-2"
          >
            <div className="font-['Exo_2'] text-sm text-muted-foreground uppercase tracking-wide">
              Sua Nota
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="font-['Orbitron'] text-7xl font-black"
              style={{
                background:
                  rating >= 90
                    ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                    : rating >= 75
                    ? "linear-gradient(135deg, #8338ec 0%, #ff006e 100%)"
                    : rating >= 60
                    ? "linear-gradient(135deg, #00D9FF 0%, #7c3aed 100%)"
                    : "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 20px rgba(131, 56, 236, 0.8))",
              }}
            >
              {rating}
            </motion.div>
          </motion.div>

          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
              >
                <Star
                  size={40}
                  weight={index < stars ? "fill" : "regular"}
                  className={
                    index < stars
                      ? "text-accent glow-accent"
                      : "text-muted-foreground"
                  }
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="font-['Exo_2'] text-sm text-muted-foreground uppercase tracking-wide">
                Sua Pontuação
              </div>
              <div className="font-['Orbitron'] text-5xl font-bold glow-text">
                {score.toLocaleString()}
              </div>
            </div>

            {/* Mensagem de agradecimento */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 py-4 px-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30"
            >
              <Heart
                size={20}
                weight="fill"
                className="text-pink-400 animate-pulse"
              />
              <p className="font-['Exo_2'] text-base font-semibold text-pink-200">
                {thankYouMessage}
              </p>
            </motion.div>

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
  );
}
