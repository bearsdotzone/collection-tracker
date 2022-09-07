import styles from "./SearchSidebarStyles.module.css";
import React, { useState, useEffect } from "react";

const SearchSidebar: React.FC = () => {
  const [content, setContent] = useState("");
  const [results, setResults] = useState([]);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const api_req = await fetch("/api/search?q=" + content);

    if (api_req.status == 204) {
      setResults([{ name: "No Results" }]);
      return;
    }

    const api_res = await api_req.json();

    setResults(api_res);
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
          <li key={item["id"]}>{item["printed_name"] || item["name"]}</li>
        ))}
      </ul>
    </div>
  );
};
export default SearchSidebar;
