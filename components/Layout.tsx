import React, { Dispatch, ReactNode,SetStateAction,useState } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>> ;
};


const Layout: React.FC<Props> = (props) => {
  
  return (
  <div>
    <Header darkMode={props.darkMode} setDarkMode={props.setDarkMode}/>
    <div className="layout">{props.children}</div>
    <style jsx global>{`
      html {
        box-sizing: border-box;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        background: ${props.darkMode? "rgba(0, 0, 0, 1.0)": "rgba(0, 0, 0, 0.05)"} ;
      }

      input,
      textarea {
        font-size: 16px;
      }

      button {
        cursor: pointer;
        ${props.darkMode? "background-color: rgb(128,128,128);" : ""}
      }

      h1{
        ${props.darkMode ? "color: #FFFFFF" : ""}
      }
    `}</style>
    <style jsx>{`
      .layout {
        padding: 0 2rem;
      }
    `}</style>
  </div>
);}

export default Layout;
