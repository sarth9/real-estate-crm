interface ReminderStatusBadgeProps {
  status: "PENDING" | "DONE" | "MISSED";
}

const reminderStyles: Record<ReminderStatusBadgeProps["status"], string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  DONE: "bg-green-100 text-green-700",
  MISSED: "bg-red-100 text-red-700",
};

export function ReminderStatusBadge({ status }: ReminderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${reminderStyles[status]}`}
    >
      {status}
    </span>
  );
}