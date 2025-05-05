"use client";

import { createContext, useState } from "react";

interface AnimationContextProps {
    isExiting: boolean;
    setIsExiting: (isExiting: boolean) => void;
    exited: boolean;
    setExited: (exited: boolean) => void;
}

export const AnimationContext = createContext<AnimationContextProps>({isExiting: false, setIsExiting: () => {}, exited: false, setExited: () => {}});