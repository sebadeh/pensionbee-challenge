export interface NavigationItem {
  name: string;
  path: string;
  children?: NavigationItem[];
}

export const fetchNavigation = async (): Promise<string[]> => {
  const response = await fetch("/api/navigation");
  if (!response.ok) {
    throw new Error("Failed to fetch navigation");
  }
  return response.json();
};
