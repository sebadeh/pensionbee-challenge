import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { fetchContent } from "../../services/contentService";
import SkeletonLoader from "../../SkeletonLoader/SkeletonLoader";
import NotFound from "../NotFound/NotFound";
import "./ContentPage.css";
import "../../styles/content.css";

const ContentPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.startsWith("/")
    ? location.pathname.slice(1)
    : location.pathname;
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        console.log("Fetching content for path:", path);
        const markdownContent = await fetchContent(path);
        const renderer = new marked.Renderer();
        renderer.link = (href: string, text: string) => {
          const cleanHref = href.startsWith("/") ? href.slice(1) : href;
          return `<a href="${cleanHref}" onclick="event.preventDefault(); window.history.pushState({}, '', '/${cleanHref}'); return false;">${text}</a>`;
        };
        marked.setOptions({ renderer });
        const htmlContent = marked.parse(markdownContent) as string;
        setContent(htmlContent);
      } catch (err) {
        if (err instanceof Error && err.message === "Content not found") {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [path]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        e.preventDefault();
        const href = target.getAttribute("href");
        if (href) {
          navigate(href);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [navigate]);

  if (loading) {
    return (
      <div className="content-page loading">
        <div className="content-skeleton">
          <SkeletonLoader height="32px" width="80%" className="title" />
          <SkeletonLoader height="24px" width="100%" className="paragraph" />
          <SkeletonLoader height="24px" width="95%" className="paragraph" />
          <SkeletonLoader height="24px" width="90%" className="paragraph" />
          <SkeletonLoader height="24px" width="85%" className="paragraph" />
          <SkeletonLoader height="24px" width="100%" className="paragraph" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return <NotFound />;
  }

  if (error) {
    return (
      <div className="content-page error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default ContentPage;
