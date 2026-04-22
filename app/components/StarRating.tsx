"use client";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "lg";
  interactive?: false;
}

interface InteractiveStarRatingProps {
  rating: number;
  size?: "sm" | "lg";
  interactive: true;
  onChange: (rating: number) => void;
}

type Props = StarRatingProps | InteractiveStarRatingProps;

export default function StarRating(props: Props) {
  const { rating, size = "sm" } = props;
  const interactive = "interactive" in props && props.interactive;
  const textSize = size === "lg" ? "text-2xl" : "text-sm";

  return (
    <span className={`flex items-center gap-0.5 ${textSize}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={interactive && "onChange" in props ? () => props.onChange(i) : undefined}
          className={[
            i <= rating ? "text-yellow-400" : "text-zinc-600",
            interactive ? "cursor-pointer hover:text-yellow-300 transition-colors" : "",
          ].join(" ")}
        >
          ★
        </span>
      ))}
    </span>
  );
}
