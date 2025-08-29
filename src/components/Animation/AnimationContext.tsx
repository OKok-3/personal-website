"use client";

import { createContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

type AnimationContextType = {
  setExiting: (exiting: boolean) => void;
  exiting: boolean;
  setPath: (path: string) => void;
  path: string;
};

export const AnimationContext = createContext<AnimationContextType>({
  exiting: false,
  setExiting: () => {},
  setPath: () => {},
  path: "/",
});

export const AnimationContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const { children } = props;
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const [path, setPath] = useState("/");

  return (
    <AnimationContext.Provider value={{ exiting, setExiting, path, setPath }}>
      <AnimatePresence
        onExitComplete={() => {
          router.push(path);
          setExiting(false);
          setPath("/");
        }}
      >
        {!exiting && children}
      </AnimatePresence>
    </AnimationContext.Provider>
  );
};
