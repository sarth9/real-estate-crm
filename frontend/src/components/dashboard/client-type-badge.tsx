interface ClientTypeBadgeProps {
  type: "BUYER" | "SELLER" | "INVESTOR" | "TENANT";
}

const typeStyles: Record<ClientTypeBadgeProps["type"], string> = {
  BUYER: "bg-blue-100 text-blue-700",
  SELLER: "bg-green-100 text-green-700",
  INVESTOR: "bg-purple-100 text-purple-700",
  TENANT: "bg-yellow-100 text-yellow-700",
};

export function ClientTypeBadge({ type }: ClientTypeBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeStyles[type]}`}
    >
      {type}
    </span>
  );
}