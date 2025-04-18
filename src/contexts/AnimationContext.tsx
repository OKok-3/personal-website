"use client";

import { AnimationControls, useAnimationControls } from "motion/react";
import { useState, createContext, ReactNode } from "react";

type AnimationContextType = {
    beginHeaderAnimation: boolean;
    setBeginHeaderAnimation: (beginHeaderAnimation: boolean) => void;
    beginSocialsAnimation: boolean;
    setBeginSocialsAnimation: (beginSocialsAnimation: boolean) => void;
    exiting: boolean;
    setExiting: (exiting: boolean) => void;
    exited: boolean;
    setExited: (exited: boolean) => void;
};

const initialState: AnimationContextType = {
    beginHeaderAnimation: false,
    setBeginHeaderAnimation: (beginHeaderAnimation: boolean) => {},
    beginSocialsAnimation: false,
    setBeginSocialsAnimation: (beginSocialsAnimation: boolean) => {},
    exiting: false,
    setExiting: (exiting: boolean) => {},
    exited: false,
    setExited: (exited: boolean) => {},
};

export const AnimationContext = createContext<AnimationContextType>(initialState);

export const AnimationContextProvider = ({ children }: { children: ReactNode }) => {
    const [beginHeaderAnimation, setBeginHeaderAnimation] = useState(false);
    const [beginSocialsAnimation, setBeginSocialsAnimation] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [exited, setExited] = useState(false);
    
    return (
        <AnimationContext.Provider value={
            {
                beginHeaderAnimation,
                setBeginHeaderAnimation,
                beginSocialsAnimation,
                setBeginSocialsAnimation,
                exiting,
                setExiting,
                exited,
                setExited,
            }
        }>
            {children}
        </AnimationContext.Provider>
    );
}