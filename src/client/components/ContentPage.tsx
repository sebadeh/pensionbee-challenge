import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ContentPage.css";

const ContentPage = () => {
  const { path } = useParams();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/${path || ""}`);
        if (!response.ok) {
          throw new Error("Page not found");
        }
        const html = await response.text();
        setContent(html);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setContent("");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [path]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div
      className="content-page"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ContentPage;
