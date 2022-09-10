import styles from "./SearchSidebarStyles.module.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SearchResult from "./SearchResult";

const SearchSidebar: React.FC = () => {
  const [content, setContent] = useState("");
  const [results, setResults] = useState([]);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // parse content with search-query-parser

    const api_req = await fetch("/api/search?q=" + content);

    if (api_req.status == 204) {
      setResults([{ name: "No Results" }]);
      return;
    }

    const api_res = await api_req.json();

    // api_req.json returns an array of key, value maps, we only want the values.
    var transformed_results: JSON[] = [];
    api_res.forEach((element) => {
      transformed_results.push(JSON.parse(element["$"]));
    });

    // console.log(transformed_results);

    setResults(transformed_results);
  };

  return (
    <div className={styles.searchsidebar}>
      <form onSubmit={submitData}>
        <input
          type="search"
          onChange={(e) => setContent(e.target.value)}
          placeholder="Query"
          value={content}
          required={true}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {results.map((item) => (
          <li key={item["id"]}>
            <SearchResult
              name={item["printed_name"] ? item["printed_name"] : item["name"]}
              foil={
                item["foil"] || (item["finishes"] && "foil" in item["finishes"])
              }
              nonfoil={
                item["nonfoil"] ||
                (item["finishes"] && "nonfoil" in item["finishes"])
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SearchSidebar;
