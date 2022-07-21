import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ReactPaginate from "react-paginate";

// const getLocalItems = () => {
//   let sq = localStorage.getItem("squery");

//   if (sq) {
//     return JSON.parse(localStorage.getItem("squery"));
//   } else {
//     return [];
//   }
// };

const Search = () => {
  const [searchParams, setSearchparams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query"));
  const [imgData, setImgData] = useState([]);
  let limit = 12;


  //Search function 

  const searchPhoto = () => {
    axios
      .get(
        `https://api.unsplash.com/search/photos?page=1&per_page=100&query=${query}&client_id=r3Mshqs_Ujo7bLYEGBpIJX9H2ZDX4z0KC-J4CESiOz8`
      )
      .then((response) => {
        const total = response.data.results.length;

        setpageCount(Math.ceil(total / limit));

        setImgData(response.data.results);
      });
  };



  const handleKeypress = e => {
    //it triggers by pressing the enter key
  if (e.keyCode === 13) {
    searchPhoto();
  }
}



  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    setSearchparams({
      query: newQuery,
    });
  };


  useEffect(() => {
    localStorage.setItem("squery", JSON.stringify(query));
  }, [query]);

  const [pageCount, setpageCount] = useState(0);

  useEffect(() => {
    searchPhoto();
  }, [limit]);




  //Pagination Start

  const fetchsearchPhoto = (currentPage) => {
    axios
      .get(
        `https://api.unsplash.com/search/photos?page=${currentPage}&per_page=${limit}&query=${query}&client_id=r3Mshqs_Ujo7bLYEGBpIJX9H2ZDX4z0KC-J4CESiOz8`
      )
      .then((response) => {
        const data = response.data.results;
        console.log(data);
        setImgData(response.data.results);
        return data;
        
      });
  };

// Send update Data on pagenation click

  const handlePageClick = (data) => {
    let currentPage = data.selected + 1;
    const newdata = [];
     newdata = fetchsearchPhoto(currentPage);

    setImgData(newdata);


  };

  return (
    <>

    {/* Search form start  */}
    
      <div className="search-box-sec p-5 bg-primary text-white text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="heading">All the assets you need, in one place</h1>
            </div> 
            <div className="col-lg-10">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  
                  id="usr"
                  value={query}
                  placeholder={query}
                />
              </div>
            </div>
            <div className="col-lg-2">
              <button
                type="submit"
                onClick={searchPhoto}
                className="btn btn-danger"
                style={{ width: "100%" }}
                onKeyPress={handleKeypress}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

 {/* Search form End  */}



      
    {/* loop all image using map    */}
      <div className="container mt-5">
        <div className="gal">
          {imgData.map((value, index) => {
            return (
              <LazyLoadImage
                src={value.urls.small}
                effect="blur"
                alt="image"
                className=""
                key={index}
              />
            );
          })}
        </div>






{/* Pagination component */}
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </>
  );
};

export default Search;
