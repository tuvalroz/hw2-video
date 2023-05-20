import { Dispatch, SetStateAction, createContext, useState } from 'react';

const emptySetDarkModeFunction: Dispatch<SetStateAction<boolean>> = (value: SetStateAction<boolean>) => {};

const darkModeContext = createContext({
    darkMode:true,
    setDarkMode:emptySetDarkModeFunction,
});

export default darkModeContext;

