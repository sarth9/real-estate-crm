interface StatusBadgeProps {
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST";
}

const statusStyles: Record<StatusBadgeProps["status"], string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  QUALIFIED: "bg-purple-100 text-purple-700",
  CLOSED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}