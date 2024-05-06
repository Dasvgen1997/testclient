import React, { useState, useEffect } from "react";
import "./FilterModal.sass";

import axios from "axios";

import { Post } from "../../interfaces/Post.interface";

interface Props {
  show: boolean;
  closeHandler: Function;
  setPostsAndFlag: Function;
}

const FilterModal: React.FC<Props> = ({
  show,
  closeHandler,
  setPostsAndFlag,
}) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const clearFields = () => {
    setTitle("");
    setBody("");
  };

  useEffect(() => {
    if (!show) {
      clearFields();
    }
  }, [show]);

  const searchHandler = (e) => {
    e.preventDefault();

    axios
      .get(`/posts/search`, {
        params: {
          title,
          body,
        },
      })
      .then(({ data }) => {
        setPostsAndFlag(data);
        // addHandler(data);
        closeHandler();
      })
      .catch((e) => {
        console.error("Error:", e);
      });
  };

  let isOneFeildExist = title || body;

  if (!show) return null;

  return (
    <div className="PostModal">
      <div className="PostModal_window">
        <header className="PostModal_header">
          <h4>Поиск постов</h4>
          <button onClick={() => closeHandler()}>закрыть</button>
        </header>
        <form onSubmit={searchHandler}>
          <input
            value={title}
            type="text"
            className="PostModal_title-input"
            placeholder="Заголовок"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={body}
            placeholder="Тело"
            className="PostModal_body-input"
            rows={4}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            disabled={!isOneFeildExist}
            className="PostModal_submit"
            type="submit"
          >
            Искать
          </button>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;
