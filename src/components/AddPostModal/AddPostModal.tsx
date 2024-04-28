import React, { useState, useEffect } from "react";
import "./AddPostModal.sass";

import axios from "axios";

interface Props {
  show: boolean;
  closeHandler: Function;
  addHandler: Function;
}

const Modal: React.FC<Props> = ({ show, closeHandler, addHandler }) => {
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

  const isFullFields = title && body;

  const fetchAdd = (e) => {
    e.preventDefault();
    axios
      .post(`/posts`, {
        title,
        body,
      })
      .then(({ data }) => {
        addHandler(data);
        closeHandler();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (!show) return null;

  return (
    <div className="AddPostModal">
      <div className="AddPostModal_window">
        <header className="AddPostModal_header">
          <h4>Добавить пост</h4>
          <button onClick={() => closeHandler()}>закрыть</button>
        </header>
        <form onSubmit={fetchAdd}>
          <input
            value={title}
            type="text"
            className="AddPostModal_title-input"
            placeholder="Заголовок"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={body}
            placeholder="Тело"
            className="AddPostModal_body-input"
            rows={4}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            disabled={!isFullFields}
            className="AddPostModal_submit"
            type="submit"
          >
            Добавить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
