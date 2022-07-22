import React, { useState, useEffect } from "react";


const Pagination = ({ pages, setCurrentPage }) => {
    const numOfPages = [];
  

  for (let i = 0; i < pages; i++) {
    numOfPages.push(i+1);
  }

  const [currentButton, setCurrentButton] = useState(1);



  useEffect(() => {
    setCurrentPage(currentButton);
  }, [currentButton, setCurrentPage]);





  return (
    <div className="clearfix">
      <div
        className="pagination  "
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div className="hint-text">
          {currentButton} / {pages}
        </div>

        <ul className="pagination ">
          {/* ### PREVIOUS ### */}
          <li
            className={`${
              currentButton === 1 ? "page-item disabled" : "page-item"
            }`}
            href="#!"
            onClick={() =>
              setCurrentButton((prev) => (prev === 1 ? prev : prev - 1))
            }
          >
            <a href="#!" className="page-link">
              {" "}
              Previous
            </a>
          </li>

          {/* ### NUMBER OF PAGES ### */}
          {numOfPages.map((page, i) => {
            return (
              <li
                key={i}
                className={`${
                  currentButton === page ? "page-item active" : "page-item"
                }`}
              >
                <a
                  className="page-link"
                  href="#!"
                  onClick={() => setCurrentButton(page)}
                >
                  {page}
                </a>
              </li>
            );
          })}

          {/* ### NEXT ### */}
          <li
            className={`${
              currentButton === numOfPages.length
                ? "page-item disabled"
                : "page-item"
            }`}
            href="#!"
            onClick={() =>
              setCurrentButton((prev) =>
                prev === numOfPages.length ? prev : prev + 1
              )
            }
          >
            <a href="#!" className="page-link">
              Next
              <i className="fa fa-angle-left"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
