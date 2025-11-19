import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import useSendRequest from "../../../hook/useSendRequest";
import type { AllPostsData, PostComment } from "../../../hook/useSendRequest";
const URL = import.meta.env.VITE_BACKEND_URL;

type PostCommentProps = {
  setShowCommentForm: React.Dispatch<React.SetStateAction<boolean>>;
  postData: {
    postId: number;
    postAuthor: string;
  };
  setAllPosts: React.Dispatch<React.SetStateAction<AllPostsData[]>>;
};

function PostComment({
  setShowCommentForm,
  postData,
  setAllPosts,
}: PostCommentProps) {
  const [postComment, setPostComment] = useState("");
  const { fetchAPIs, data } = useSendRequest();
  const hideCommentFormFunction = () => setShowCommentForm(false);

  useEffect(() => {
    if (!data) return;
    if (data.message === "comment on post" && data.newComment) {
      const newComment = data?.newComment;
      if (!newComment) return;
      setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === data.postId
            ? { ...post, comments: [...(post.comments || []), newComment] }
            : post
        )
      );
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const lines = newValue.split("\n");
    if (lines.length <= 3) {
      setPostComment(newValue);
    }
  };
  async function commentPost(
    e: React.FormEvent<HTMLFormElement>,
    postId: number,
    postComment: string
  ) {
    e.preventDefault();
    fetchAPIs("POST", `${URL}/commentPost`, { postId, postComment });
    setPostComment("");
    hideCommentFormFunction();
  }
  return (
    <>
      <button
        type="button"
        onClick={hideCommentFormFunction}
        className="close-form-button"
      >
        <IoClose />
      </button>
      <form
        action=""
        onSubmit={(e) => commentPost(e, postData.postId, postComment)}
        className={"comment-form"}
      >
        <label htmlFor="postComment">Comment on post</label>
        <textarea
          name="postComment"
          id="postComment"
          maxLength={150}
          rows={4}
          spellCheck="false"
          placeholder={`Comment on ${postData.postAuthor}'s post`}
          value={postComment}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Comment</button>
      </form>
    </>
  );
}

export default PostComment;
