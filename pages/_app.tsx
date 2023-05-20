import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import darkModeContext from '../components/darkModeContext';
import { useState } from "react";

const App = ({ Component, pageProps }: AppProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <darkModeContext.Provider value={{darkMode,setDarkMode}}>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
    </darkModeContext.Provider>
  );
};

export default App;
