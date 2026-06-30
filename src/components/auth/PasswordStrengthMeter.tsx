import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[0-9]/, text: "Contains a number" },
    { regex: /[A-Z]/, text: "Contains uppercase letter" },
    { regex: /[^A-Za-z0-9]/, text: "Contains special character" },
  ];

  const calculateStrength = () => {
    if (!password) return 0;
    let strength = 0;
    requirements.forEach((req) => {
      if (req.regex.test(password)) strength += 1;
    });
    return strength;
  };

  const strength = calculateStrength();
  const getStrengthColor = () => {
    if (strength === 0) return "bg-muted";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength === 0) return "";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <motion.div
              key={level}
              className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                level <= strength ? getStrengthColor() : "bg-border/50"
              }`}
              initial={false}
              animate={{ opacity: level <= strength ? 1 : 0.5 }}
            />
          ))}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${getStrengthColor().replace('bg-', 'text-')}`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-y-1">
        {requirements.map((req, index) => {
          const isValid = req.regex.test(password);
          return (
            <div key={index} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              {isValid ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <X className="w-3 h-3 text-muted-foreground/50" />
              )}
              <span className={isValid ? "text-foreground" : ""}>{req.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
