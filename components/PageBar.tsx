import React, { useContext } from "react";
import { useRouter } from 'next/router';
import darkModeContext from "./darkModeContext";

const PageBar: React.FC<{ currentPage: number, numberOfPosts: number, pageSize: number }> = ({ currentPage, numberOfPosts, pageSize }) => {
  const router = useRouter();
  const darkMode = useContext(darkModeContext).darkMode;
  const goToPageHandler = (i: number) => {
    router.replace({ pathname: router.asPath.split("?")[0], query: { page: currentPage + i } });
  }

  return (
    <div className="pagination">
      {currentPage > 2 && <a onClick={() => goToPageHandler(-2)} >{currentPage - 2}</a>}
      {currentPage > 1 && <a onClick={() => goToPageHandler(-1)} >{currentPage - 1}</a>}
      <a className="active">{currentPage}</a>
      {currentPage < (numberOfPosts / pageSize) && <a onClick={() => goToPageHandler(+1)} >{currentPage + 1}</a>}
      {currentPage < (numberOfPosts / pageSize) - 1 && <a onClick={() => goToPageHandler(+2)} >{currentPage + 2}</a>}

      <style jsx>{`
        div{
          position: absolute;
          left: 40%;
        }
        .pagination {
          display: inline-block;
        }
        
        .pagination a {
          color: ${darkMode? "white" : "black"};
          float: left;
          padding: 8px 16px;
          text-decoration: none;
          cursor: pointer;
        }
        
        .pagination a.active {
          background-color: #4CAF50;
          color: white;
          border-radius: 5px;
        }
        
        .pagination a:hover:not(.active) {
          background-color: #ddd;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default PageBar;
