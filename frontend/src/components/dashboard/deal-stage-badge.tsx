interface DealStageBadgeProps {
  stage: "NEGOTIATION" | "AGREEMENT" | "CLOSED";
}

const stageStyles: Record<DealStageBadgeProps["stage"], string> = {
  NEGOTIATION: "bg-yellow-100 text-yellow-700",
  AGREEMENT: "bg-blue-100 text-blue-700",
  CLOSED: "bg-green-100 text-green-700",
};

export function DealStageBadge({ stage }: DealStageBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stageStyles[stage]}`}
    >
      {stage}
    </span>
  );
}