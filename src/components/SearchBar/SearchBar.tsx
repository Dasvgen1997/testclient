import React, { useEffect, useState } from "react";
import "./SearchBar.sass";

interface Props {
  isRange: boolean;
  searchRangeHandler: Function;
  rangeSearchCancelHandler: Function;
  sortMode: string;
  setSortMode: Function;
  sortCodes: string[];
  getSortName: Function;
  modalShowFilter: boolean;
  setModalShowFilter: Function;
  isSearchFilter: boolean;
  setIsSearchFilter: Function;
}

const SearchBar: React.FC<Props> = ({
  searchRangeHandler,
  rangeSearchCancelHandler,
  isRange = false,
  sortMode,
  setSortMode,
  sortCodes,
  getSortName,
  modalShowFilter,
  setModalShowFilter,
  isSearchFilter,
  setIsSearchFilter
}) => {
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(10);

  useEffect(() => {
    if (from > to) {
      setTo(from + 1);
    }
  }, [from]);

  const nextSortHandler = () => {
    let i = sortCodes.indexOf(sortMode);
    let nextItem = sortCodes[i + 1];

    if (nextItem) {
      setSortMode(nextItem);
    } else {
      setSortMode(sortCodes[0]);
    }
  };

  return (
    <div className="Search-bar">
      <div className="Search-bar_row">
        <div className="Search-bar_wrap-range">
          <p>От и до:</p>
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

        <div className="Search-bar_wrap-sort">
          <p>Сортировка:</p>
          <button onClick={nextSortHandler}>{getSortName(sortMode)}</button>
        </div>
      </div>

      <div>
        {isSearchFilter ? (
          <button
            onClick={() => {
              setIsSearchFilter(false);
            }}
          >
            Сбросить фильтр
          </button>
        ) : (
          <button
            onClick={() => {
              setModalShowFilter(true);
            }}
          >
            Поиск по фильтру
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
