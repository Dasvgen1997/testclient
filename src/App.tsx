import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import "./App.sass";
import PostItem from "./components/PostItem/PostItem.tsx";
import SearchBar from "./components/SearchBar/SearchBar.tsx";
import AddPostModal from "./components/AddPostModal/AddPostModal.tsx";

import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  createdAt: string;
}

const LIMIT_POSTS = 10;

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("main");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);

  const containerRef = useRef<HTMLElement>();

  useEffect(() => {
    setPosts([]);
    if (mode == "main") {
      fetchScroll();
    } else if (mode == "range") {
      fetchRange();
    }
  }, [mode]);

  const fetchScroll = () => {
    setLoading(true);
    axios
      .get("/posts", {
        params: {
          _start: posts.length,
          _limit: LIMIT_POSTS,
        },
      })
      .then(({ data }) => {
        setPosts((prevPosts) => [...prevPosts, ...data]);
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
      if (!loading && hasMore && containerRef.current && mode == "main") {
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

  return (
    <div className="App">
      <div className="App_container">
        <SearchBar
          searchRangeHandler={rangeSearchHandler}
          rangeSearchCancelHandler={rangeSearchCancelHandler}
          isRange={mode == "range"}
        />
        <AddPostModal
          show={showModalAdd}
          closeHandler={() => {
            setShowModalAdd(false);
          }}
          addHandler={addPostItem}
        />
        <button
          onClick={() => {
            setShowModalAdd(true);
          }}
        >
          Добавить пост
        </button>
        <div className="App_post-list">
          {posts.map((p) => {
            return (
              <PostItem
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

export default App;
