const API_URL = import.meta.env.VITE_API_URL || "";

export interface NavigationItem {
  name: string;
  path: string;
  children?: NavigationItem[];
}

export const fetchNavigation = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/navigation`);
  if (!response.ok) {
    throw new Error("Failed to fetch navigation");
  }
  return response.json();
};
