"use client";

import { useState, createContext, ReactNode } from "react";

type AnimationContextType = {
    beginHeaderAnimation: boolean;
    setBeginHeaderAnimation: (beginHeaderAnimation: boolean) => void;
    beginSocialsAnimation: boolean;
    setBeginSocialsAnimation: (beginSocialsAnimation: boolean) => void;
};

const initialState: AnimationContextType = {
    beginHeaderAnimation: true,
    setBeginHeaderAnimation: () => {},
    beginSocialsAnimation: true,
    setBeginSocialsAnimation: () => {},
};

export const AnimationContext = createContext<AnimationContextType>(initialState);

export const AnimationContextProvider = ({ children }: { children: ReactNode }) => {
    const [beginHeaderAnimation, setBeginHeaderAnimation] = useState(false);
    const [beginSocialsAnimation, setBeginSocialsAnimation] = useState(false);

    return (
        <AnimationContext.Provider value={{ beginHeaderAnimation, setBeginHeaderAnimation, beginSocialsAnimation, setBeginSocialsAnimation }}>
            {children}
        </AnimationContext.Provider>
    );
}