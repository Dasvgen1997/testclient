import React, { useState, useEffect } from "react";
import "./PostModal.sass";

import axios from "axios";

import { Post } from "../../interfaces/Post.interface";

interface Props {
  show: boolean;
  closeHandler: Function;
  addHandler: Function;
  changeHandler: Function,
  data: Post | null;
}

const Modal: React.FC<Props> = ({ show, closeHandler, addHandler, changeHandler, data }) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const clearFields = () => {
    setTitle("");
    setBody("");
  };

  useEffect(() => {
    if (!show) {
      clearFields();
    } else {
      if (data) {
        setTitle(data.title);
        setBody(data.body);
      }
    }
  }, [show]);

  const isFullFields = title && body;
  const isEdit = !!data;

  const fetchAdd = (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        axios
          .put(`/posts/${data.id}`, {
            title,
            body,
          })
          .then(({ data }) => {
            changeHandler(data);
            closeHandler();
          });

      } else {
        axios
          .post(`/posts`, {
            title,
            body,
          })
          .then(({ data }) => {
            addHandler(data);
            closeHandler();
          });
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (!show) return null;

  return (
    <div className="PostModal">
      <div className="PostModal_window">
        <header className="PostModal_header">
          <h4>{isEdit ? "Измнить" : "Добавить"} пост</h4>
          <button onClick={() => closeHandler()}>закрыть</button>
        </header>
        <form onSubmit={fetchAdd}>
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
            disabled={!isFullFields}
            className="PostModal_submit"
            type="submit"
          >
            {isEdit ? "Сохранить" : "Добавить"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
