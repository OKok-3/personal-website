"use client";

import { useState, createContext, ReactNode } from "react";

type AnimationContextType = {
    continueAnimation: boolean;
    setContinueAnimation: (continueAnimation: boolean) => void;
};

const initialState: AnimationContextType = {
    continueAnimation: true,
    setContinueAnimation: () => {},
};

export const AnimationContext = createContext<AnimationContextType>(initialState);

export const AnimationContextProvider = ({ children }: { children: ReactNode }) => {
    const [continueAnimation, setContinueAnimation] = useState(false);

    return (
        <AnimationContext.Provider value={{ continueAnimation, setContinueAnimation }}>
            {children}
        </AnimationContext.Provider>
    );
}