import React, { useState, useEffect, useRef } from "react";
import "./App.sass";
import PostItem from "./components/PostItem/PostItem.tsx";
import SearchBar from "./components/SearchBar/SearchBar.tsx";
import PostModal from "./components/PostModal/PostModal.tsx";
import FilterModal from "./components/FilterModal/FilterModal.tsx";

import axios from "axios";

import { Post } from "./interfaces/Post.interface.ts";

const LIMIT_POSTS = 10;

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("main");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<Post | null>(null);
  const [sortMode, setSortMode] = useState<string>(sortCodes[0]);
  const [modalShowFilter, setModalShowFilter] = useState<boolean>(false);
  const [isSearchFilter, setIsSearchFilter] = useState<boolean>(false);

  const containerRef = useRef<HTMLElement>();

  useEffect(() => {
    if(isSearchFilter) return;
    setPosts([]);
    if (mode == "main") {
      fetchScroll();
    } else if (mode == "range") {
      fetchRange();
    }
  }, [mode, isSearchFilter]);

  useEffect(() => {
    if (sortMode == "none"|| isSearchFilter) return;
    if (mode == "main") {
      fetchScroll(true);
    } else if (mode == "range") {
      fetchRange();
    }
  }, [sortMode, isSearchFilter]);

  const fetchScroll = (isSorting = false) => {
    setLoading(true);

    let params = {};
    if (isSorting) {
      params = {
        _start: 0,
        _limit: posts.length,
        _sort: sortMode,
      };
    } else {
      params = {
        _start: posts.length,
        _limit: LIMIT_POSTS,
        _sort: sortMode,
      };
    }

    axios
      .get("/posts", {
        params,
      })
      .then(({ data }) => {
        if (isSorting) {
          setPosts(data);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data]);
        }
        setHasMore(data.length === LIMIT_POSTS);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!loading && hasMore && containerRef.current && mode == "main" && !isSearchFilter) {
        const container = containerRef.current;
        const { top, bottom } = container.getBoundingClientRect();
        const isVisible = top >= 0 && bottom <= window.innerHeight;

        if (isVisible) {
          fetchScroll();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore, mode]);

  const fetchRange = () => {
    setLoading(true);
    axios
      .get("/posts", {
        params: {
          _start: start,
          _limit: end,
          _sort: sortMode,
        },
      })
      .then(({ data }) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const rangeSearchHandler = (start: number, end: number) => {
    setStart(start);
    setEnd(end);
    setMode("range");
  };
  const rangeSearchCancelHandler = () => {
    setMode("main");
  };

  const deleteItemHandler = (id) => {
    axios
      .delete(`/posts/${id}`)
      .then(() => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addPostItem = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };
  const changePostItem = (upd: Post) => {
    setPosts((prev) => prev.map((p) => (p.id == upd.id ? upd : p)));
  };

  return (
    <div className="App">
      <div className="App_container">
        <SearchBar
          sortMode={sortMode}
          setSortMode={setSortMode}
          getSortName={getSortName}
          sortCodes={sortCodes}
          searchRangeHandler={rangeSearchHandler}
          rangeSearchCancelHandler={rangeSearchCancelHandler}
          isRange={mode == "range"}
          modalShowFilter={modalShowFilter}
          setModalShowFilter={setModalShowFilter}
          isSearchFilter={isSearchFilter}
          setIsSearchFilter={setIsSearchFilter}
        />
        <FilterModal
          show={modalShowFilter}
          closeHandler={() => {
            setModalShowFilter(false);
          }}
          setPostsAndFlag={(posts: Post[]) => {
            setPosts(posts);
            setIsSearchFilter(true);
          }}
        />
        <PostModal
          show={showModal}
          data={modalData}
          closeHandler={() => {
            setShowModal(false);
            setModalData(null);
          }}
          addHandler={addPostItem}
          changeHandler={changePostItem}
        />
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          Добавить пост
        </button>
        <div className="App_post-list">
          {posts.map((p) => {
            return (
              <PostItem
                editHandler={() => {
                  setModalData(p);
                  setShowModal(true);
                }}
                key={p.id}
                id={p.id}
                title={p.title}
                body={p.body}
                createdAt={p.createdAt}
                deleteItemHandler={deleteItemHandler}
              />
            );
          })}
          {loading && <LoadingText />}
          <div ref={containerRef} />
        </div>
      </div>
    </div>
  );
};

function LoadingText() {
  return <p className="App_loading-text">Загрузка данных..</p>;
}

const sortCodes = ["none", "title_ASC", "title_DESC", "body_ASC", "body_DESC"];

function getSortName(code: string) {
  switch (code) {
    case "none":
      return "Без";
    case "title_ASC":
      return "Заголовок ASC";
    case "title_DESC":
      return "Заголовок DESC";
    case "body_ASC":
      return "Тело ASC";
    case "body_DESC":
      return "Тело DESC";
    default:
      return "Неизвестно";
  }
}

export default App;
