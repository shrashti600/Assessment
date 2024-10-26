import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const List = () => {
  const [posts, setPost] = useState([]);
  const [editingPost, setEditPost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [type, setType] = useState("");

  useEffect(() => {
    const getData = async () => {
      await fetchPosts();
      const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
      setPost(savedPosts);
    };
    getData();
  }, []);

  const fetchPosts = () => {
    setIsLoading(true);
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((resp) => {
        setIsLoading(false);
        localStorage.setItem("posts", JSON.stringify(resp.data));
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (post, type) => {
    setEditPost(true);
    setSelectedPost(post);
    setType(type);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPost({ ...selectedPost, [name]: value });
  };

  const handleAddEdit = () => {
    if (type === "edit") {
      setPost(
        posts?.map((e) => (e.id === selectedPost?.id ? selectedPost : e))
      );
      localStorage.setItem("posts", JSON.stringify(posts));
    } else {
      setPost([...posts, { ...selectedPost }]);
      localStorage.setItem("posts", JSON.stringify(posts));
    }
    setEditPost(false);
  };

  const handleDelete = (post) => {
    setPost(posts?.filter((e) => e.id !== post?.id));
    localStorage.setItem("posts", JSON.stringify(posts));
  };

  return (
    <>
      <div>
        {isLoading && <>Loading....</>}
        <button
          className="btn btn-success m-2"
          onClick={() => handleEdit({}, "add")}
        >
          Add Post
        </button>
        {posts.map((post, i) => (
          <ul key={i}>
            <li>
              <h3>{post?.title}</h3>
              <p>{post?.body}</p>
              <button
                className="btn btn-primary m-2"
                onClick={() => handleEdit(post, "edit")}
              >
                Edit
              </button>
              <button
                className="btn btn-danger m-2"
                onClick={() => handleDelete(post)}
              >
                Delete
              </button>
            </li>
          </ul>
        ))}
      </div>
      <Modal show={editingPost} onHide={() => setEditPost(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{type === "edit" ? "Edit" : "Add"} Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <input
              style={{ width: "100%" }}
              type="text"
              className="m-2"
              value={selectedPost?.title}
              name="title"
              onChange={(e) => handleChange(e)}
              placeholder="Enter Title..."
            />
          </div>
          <div>
            <textarea
              style={{ width: "100%" }}
              type="text"
              className="m-2"
              value={selectedPost?.body}
              name="body"
              onChange={(e) => handleChange(e)}
              placeholder="Enter body..."
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditPost(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleAddEdit()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default List;
