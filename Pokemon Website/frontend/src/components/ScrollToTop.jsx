import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly jumps to the top of the page
    window.scrollTo(0, 0);
  }, [pathname]); // Runs every time the route path changes

  return null; // This component doesn't render anything visual
};

export default ScrollToTop;