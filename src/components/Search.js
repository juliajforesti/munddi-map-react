import React, { useEffect } from "react";

const Search = (props) => {
  const { setSearchInput, filterSearch, searchInput } = props;

  useEffect(() => {
    filterSearch(searchInput);
  }, [searchInput]);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <form>
      <input
        type="text"
        placeholder="Buscar"
        value={searchInput}
        onChange={handleChange}
      />
    </form>
  );
};

export default Search;
