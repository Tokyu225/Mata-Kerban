"use client";

interface GradientTextProps {
  children: React.ReactNode;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
}

export default function GradientText({
  children,
  colors = ["#4ade80", "#22c55e", "#4ade80", "#16a34a", "#4ade80"],
  animationSpeed = 4,
  showBorder = false,
  className = "",
  as: Tag = "span",
}: GradientTextProps) {
  const gradient = colors.join(", ");
  const animDuration = `${animationSpeed}s`;

  return (
    <Tag
      className={`inline-block font-bold ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${gradient})`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `gradient-shift ${animDuration} linear infinite`,
        ...(showBorder
          ? {
              borderBottom: "2px solid",
              borderImage: `linear-gradient(to right, ${gradient}) 1`,
            }
          : {}),
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </Tag>
  );
}
