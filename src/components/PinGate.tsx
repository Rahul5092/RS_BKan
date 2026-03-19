import { useState, useRef, useEffect } from "react";
import { Lock } from "lucide-react";

const CORRECT_PIN = "2026";
const PIN_LENGTH = 4;

interface PinGateProps {
  children: React.ReactNode;
}

const PinGate = ({ children }: PinGateProps) => {
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem("pin-unlocked") === "true";
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!unlocked) {
      inputRefs.current[0]?.focus();
    }
  }, [unlocked]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError(false);

    if (value && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullPin = newPin.join("");
    if (fullPin.length === PIN_LENGTH) {
      if (fullPin === CORRECT_PIN) {
        sessionStorage.setItem("pin-unlocked", "true");
        setUnlocked(true);
      } else {
        setError(true);
        setTimeout(() => {
          setPin(Array(PIN_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        }, 600);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Enter PIN
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter the 4-digit PIN to continue
          </p>
        </div>
        <div className="flex gap-3">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 bg-card text-foreground outline-none transition-all duration-200 ${
                error
                  ? "border-destructive animate-shake"
                  : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
            />
          ))}
        </div>
        {error && (
          <p className="text-destructive text-sm font-medium">
            Incorrect PIN. Try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default PinGate;
