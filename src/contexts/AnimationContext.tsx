"use client";

import { useState, createContext, ReactNode } from "react";

type AnimationContextType = {
    beginHeaderAnimation: boolean;
    setBeginHeaderAnimation: (beginHeaderAnimation: boolean) => void;
    beginSocialsAnimation: boolean;
    setBeginSocialsAnimation: (beginSocialsAnimation: boolean) => void;
    exiting: boolean;
    setExiting: (exiting: boolean) => void;
    exitTo: string;
    setExitTo: (exitTo: string) => void;
};

const initialState: AnimationContextType = {
    beginHeaderAnimation: true,
    setBeginHeaderAnimation: () => {},
    beginSocialsAnimation: true,
    setBeginSocialsAnimation: () => {},
    exiting: false,
    setExiting: () => {},
    exitTo: "/",
    setExitTo: () => {},
};

export const AnimationContext = createContext<AnimationContextType>(initialState);

export const AnimationContextProvider = ({ children }: { children: ReactNode }) => {
    const [beginHeaderAnimation, setBeginHeaderAnimation] = useState(false);
    const [beginSocialsAnimation, setBeginSocialsAnimation] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [exitTo, setExitTo] = useState("/");

    return (
        <AnimationContext.Provider value={{ beginHeaderAnimation, setBeginHeaderAnimation, beginSocialsAnimation, setBeginSocialsAnimation, exiting, setExiting, exitTo, setExitTo }}>
            {children}
        </AnimationContext.Provider>
    );
}