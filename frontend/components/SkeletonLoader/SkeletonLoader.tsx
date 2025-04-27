import React from "react";
import "./SkeletonLoader.css";

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = "1rem",
  className = "",
}) => {
  return (
    <div className={`skeleton-loader ${className}`} style={{ width, height }} />
  );
};

export default SkeletonLoader;
