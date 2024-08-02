import React from "react";
import Link from "next/link";

const truncateContent = (content, limit) => {
  if (content.length > limit) {
    return content.substring(0, limit) + "...";
  }
  return content;
};

const PostCard = ({ post }) => {
  return (
    <Link
      href={`/post/${post.id}`}
      className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-md block hover:shadow-lg transition-shadow duration-200"
    >
      <div className="mb-4 overflow-hidden rounded">
        <img
          src={post.image || "https://via.placeholder.com/300"}
          alt="Post Image"
          className="w-full h-48 object-cover"
        />
      </div>
      <div>
        <span className="bg-primary mb-5 inline-block rounded py-1 px-4 text-center text-xs font-semibold leading-loose text-white">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-700">{truncateContent(post.content, 20)}</p>
      </div>
    </Link>
  );
};

export default PostCard;
