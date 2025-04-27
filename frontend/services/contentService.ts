export const fetchContent = async (path: string): Promise<string> => {
  try {
    const response = await fetch(`/api/${path}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Content not found");
      }
      throw new Error("Failed to fetch content");
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};
