export const statusLabels: Record<string, string> = {
  Draft: "Draft",
  Planned: "Planned",
  In_Progress: "In Progress",
  Completed: "Completed",
  Canceled: "Canceled",
};

// Reverse mapping: Display label -> Enum value
export const reverseStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(statusLabels).map(([key, value]) => [value, key]),
);
