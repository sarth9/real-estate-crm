interface UserRoleBadgeProps {
  role: "ADMIN" | "MANAGER" | "AGENT";
}

const roleStyles: Record<UserRoleBadgeProps["role"], string> = {
  ADMIN: "bg-red-100 text-red-700",
  MANAGER: "bg-blue-100 text-blue-700",
  AGENT: "bg-green-100 text-green-700",
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[role]}`}
    >
      {role}
    </span>
  );
}