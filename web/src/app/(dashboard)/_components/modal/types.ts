export type TabType = "profile" | "security" | "settings";

export type UserModalTab = {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};
