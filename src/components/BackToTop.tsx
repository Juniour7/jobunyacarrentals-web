import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react"; // optional icon

const BackToTop = () => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Show the button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {show && (
        <button
          onClick={handleClick}
          className="
          fixed bottom-6 right-6 
          bg-[#07b6d5] hover:bg-blue-700 
          text-white p-3 rounded-full 
          shadow-lg transition-all duration-300
          flex items-center justify-center z-50
        "
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default BackToTop;
