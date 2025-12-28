import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadSimple, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA instalado com sucesso');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="glass-card p-4 rounded-lg shadow-[0_0_40px_rgba(157,78,221,0.4)] neon-border">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-['Orbitron'] font-bold text-lg text-foreground mb-1">
                  Instalar Movimento Karaoke
                </h3>
                <p className="font-['Exo_2'] text-sm text-muted-foreground mb-3">
                  Instale o app para acesso rápido e use offline!
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstallClick}
                    className="gap-2 bg-primary hover:bg-primary/90 font-['Exo_2'] font-semibold"
                  >
                    <DownloadSimple size={20} weight="bold" />
                    Instalar
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                    size="icon"
                    className="border-border/50"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
