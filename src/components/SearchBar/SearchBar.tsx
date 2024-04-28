import React, { useEffect, useState } from "react";
import "./SearchBar.sass";

interface Props {
  isRange: boolean;
  searchRangeHandler: Function;
  rangeSearchCancelHandler: Function;
}

const SearchBar: React.FC<Props> = ({
  searchRangeHandler,
  rangeSearchCancelHandler,
  isRange = false,
}) => {
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(10);

  useEffect(() => {
    if (from > to) {
      setTo(from + 1);
    }
  }, [from]);

  return (
    <div className="search-bar">
      <input
        value={from}
        type="number"
        disabled={isRange}
        placeholder="От"
        onChange={(e) => setFrom(+e.target.value)}
      />
      <input
        value={to}
        disabled={isRange}
        type="number"
        placeholder="До"
        onChange={(e) => setTo(+e.target.value)}
      />
      {isRange ? (
        <button
          onClick={() => {
            rangeSearchCancelHandler();
          }}
        >
          Отмена
        </button>
      ) : (
        <button
          onClick={() => {
            searchRangeHandler(from, to);
          }}
        >
          Поиск
        </button>
      )}
    </div>
  );
};

export default SearchBar;
