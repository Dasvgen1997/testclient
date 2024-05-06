import React from "react";
import "./PostItem.sass";

interface Props {
  title: string;
  body: string;
  createdAt: string;
  id: number;
  deleteItemHandler: Function;
  editHandler: Function;
}

const PostItem: React.FC<Props> = ({
  id,
  title,
  body,
  createdAt,
  deleteItemHandler,
  editHandler,
}) => {
  return (
    <div className="post-item">
      <h4>
        #{id} <b>{title}</b>
      </h4>
      <p>{body}</p>
      <h6>{createdAt}</h6>
      <button
        onClick={() => {
          deleteItemHandler(id);
        }}
      >
        Удалить
      </button>
      <button onClick={() => editHandler()}>Изменить</button>
    </div>
  );
};

export default PostItem;
