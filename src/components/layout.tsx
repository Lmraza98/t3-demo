import type { PropsWithChildren } from "react";
import { useRef, useEffect } from "react";
import { useGlobal } from "~/contexts/global";

export const PageLayout = (props: PropsWithChildren) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scroll, setScroll } = useGlobal();
  console.log("SCROLL: ", scroll);
  let timer = null;

  const handleScroll = () => {
    if (scrollRef.current && setScroll) {
      setScroll(true);

      // Clear any existing timer
      if (timer) {
        clearTimeout(timer);
      }

      // Set a new timer to update the scroll state to false after 100ms
      timer = setTimeout(() => {
        setScroll(false);
      }, 10);
    }
  };
  

  useEffect(() => {
    const element = scrollRef.current;

    // Attach the event listeners
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollRef, setScroll, scroll]);

  

  return (
    <main className="flex h-screen justify-center">
      <div
        onScroll={(event)=> {setScroll(true)}}
        className="h-full w-full border-x border-slate-400 md:max-w-2xl overflow-y-scroll"
        style={{ height: "90vh" }}
      >
        {props.children}
      </div>
    </main>
  );
};
