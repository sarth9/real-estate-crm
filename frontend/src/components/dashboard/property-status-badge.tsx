interface PropertyStatusBadgeProps {
  status: "AVAILABLE" | "BOOKED" | "SOLD" | "RENTED";
}

const statusStyles: Record<PropertyStatusBadgeProps["status"], string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  BOOKED: "bg-yellow-100 text-yellow-700",
  SOLD: "bg-red-100 text-red-700",
  RENTED: "bg-blue-100 text-blue-700",
};

export function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}