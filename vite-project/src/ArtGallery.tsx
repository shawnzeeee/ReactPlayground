import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  // Inject a serif font for a similar look (e.g., "Playfair Display" from Google Fonts)
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Scroll transition state
  const [scrolled, setScrolled] = useState(false);
  const page2Ref = useRef<HTMLDivElement>(null);

  // Listen for scroll to bottom to trigger transition
  useEffect(() => {
    const handleScroll = () => {
      if (
        !scrolled &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2
      ) {
        setScrolled(true);
        setTimeout(() => {
          page2Ref.current?.scrollIntoView({ behavior: "smooth" });
        }, 100); // slight delay for smoothness
      } else if (scrolled && window.scrollY === 0) {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div className="scroll-smooth">
      {/* Page 1: Your current design */}
      <div
        className={
          scrolled
            ? "bg-stone-300 pointer-events-none opacity-60"
            : "bg-stone-300"
        }
      >
        <div className="min-h-screen bg-stone-300 grid grid-cols-1 md:grid-cols-14">
          {/* Centered overlay text */}
          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <h1
              className="sm:text-3xl md:text-6xl font-bold text-center"
              style={{ fontFamily: "'Lexend Exa', serif" }}
            >
              Art Gallery
            </h1>
          </div>
          {/* Nav Bar */}
          <div className="flex flex-col border-r border-black min-h-screen">
            {/* Hamburger Icon at the top */}
            <div className="flex justify-center items-center h-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
            {/* Centered "A" in the remaining space */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">A</span>
            </div>
          </div>
          <div className="flex flex-col-reverse border-r border-yellow-950 min-h-screen col-span-3">
            <img
              src="https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Art"
              className="w-full h-2/5 object-cover"
            />
          </div>
          <div className="flex flex-col border-r border-yellow-950 min-h-screen col-span-3">
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1945&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Art"
              className="w-full h-2/5 object-cover"
            />
          </div>
          <div className="flex flex-col-reverse border-r border-yellow-950 min-h-screen col-span-3">
            <img
              src="https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Art"
              className="w-full h-2/5 object-cover"
            />
          </div>
          <div className="flex flex-col border-r border-yellow-950 min-h-screen col-span-3">
            <img
              src="https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Art"
              className="w-full h-2/5 object-cover"
            />
          </div>
          {/* Right narrow column */}
          <div className="hidden md:block border-r border-yellow-950 min-h-screen"></div>
        </div>
        {/* Scroll down indicator */}
        {!scrolled && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <span className="text-3xl">↓</span>
          </div>
        )}
      </div>
      {/* Page 2: Boilerplate template */}
      <div
        ref={page2Ref}
        className="min-h-screen flex flex-col items-center justify-center bg-gray-100"
      >
        <h2 className="text-4xl font-bold mb-4">Welcome to Page 2</h2>
        <p className="text-lg text-gray-700 mb-8">
          This is a boilerplate second page. Add your content here.
        </p>
        <button
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to Top
        </button>
      </div>
    </div>
  );
}

export default App;
