import React from "react";

const posts = [
  {
    id: 1,
    title: "First Post",
    excerpt: "This is a brief summary of the first post...",
  },
  {
    id: 2,
    title: "Second Post",
    excerpt: "This is a brief summary of the second post...",
  },
  // Add more posts as needed
];

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* Left Column - User's Posts */}
      <div className="w-full md:w-2/3">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">My Posts</h2>
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {post.title}
            </h3>
            <p className="text-gray-700 mt-2 mb-4">{post.excerpt}</p>
            <a
              href={`/post/${post.id}`}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Read more
            </a>
          </div>
        ))}
      </div>

      {/* Right Column - User's Info */}
      <div className="w-full md:w-1/3">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div
            className="bg-cover bg-center h-40 rounded-lg"
            style={{
              backgroundImage: "url('https://via.placeholder.com/600x200')",
            }}
          ></div>
          <div className="text-center mt-4">
            <img
              className="w-24 h-24 object-cover rounded-full border-4 border-white -mt-12 mx-auto"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
            <h2 className="text-2xl font-semibold text-gray-900 mt-2">
              John Doe
            </h2>
            <p className="text-gray-600">Software Developer</p>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              vel tortor facilisis, varius turpis vel, tincidunt ex.
            </p>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="#" className="text-blue-500 hover:text-blue-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6.011c-.77.342-1.6.573-2.47.678a4.205 4.205 0 001.84-2.315 8.34 8.34 0 01-2.635 1.006A4.162 4.162 0 0016.105 4a4.153 4.153 0 00-4.153 4.153c0 .325.036.642.106.946A11.785 11.785 0 013 5.165a4.144 4.144 0 00-.563 2.086c0 1.44.733 2.71 1.85 3.45a4.14 4.14 0 01-1.883-.52v.052a4.156 4.156 0 003.333 4.075 4.165 4.165 0 01-1.878.071 4.159 4.159 0 003.883 2.885A8.333 8.333 0 012 19.845a11.75 11.75 0 006.352 1.863c7.614 0 11.773-6.3 11.773-11.773 0-.18-.004-.359-.012-.536a8.401 8.401 0 002.066-2.141z" />
              </svg>
            </a>
            <a href="#" className="text-blue-500 hover:text-blue-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.162c-5.48 0-9.906 4.428-9.906 9.908 0 5.482 4.426 9.908 9.906 9.908 5.48 0 9.906-4.426 9.906-9.908 0-5.48-4.426-9.908-9.906-9.908zm0 18.264c-4.602 0-8.354-3.752-8.354-8.354 0-4.602 3.752-8.354 8.354-8.354 4.602 0 8.354 3.752 8.354 8.354 0 4.602-3.752 8.354-8.354 8.354zm-2.465-6.297h1.621v1.621h-1.621v-1.621zm-2.311-2.311h1.621v3.932h-1.621v-3.932zm9.654-3.932h-1.621v1.621h1.621v-1.621zm-4.827 0h1.621v5.517h-1.621v-5.517zm0 6.207h1.621v1.621h-1.621v-1.621zm4.827 0h-1.621v1.621h1.621v-1.621zm-2.414-5.517h-1.621v5.517h1.621v-5.517z" />
              </svg>
            </a>
            <a href="#" className="text-blue-500 hover:text-blue-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.263 0H2.737C1.224 0 0 1.224 0 2.737v18.527C0 22.776 1.224 24 2.737 24h18.527C22.776 24 24 22.776 24 21.263V2.737C24 1.224 22.776 0 21.263 0zM9.327 20.663H5.975v-9.354h3.352v9.354zm-1.676-10.688h-.023c-1.125 0-1.853-.771-1.853-1.733 0-.979.742-1.733 1.892-1.733 1.149 0 1.853.754 1.876 1.733 0 .961-.728 1.733-1.892 1.733zm13.336 10.688h-3.352v-5.05c0-1.27-.454-2.137-1.588-2.137-.866 0-1.382.586-1.608 1.152-.084.201-.106.483-.106.768v5.267H11.5s.045-8.563 0-9.354h3.352v1.324c.446-.688 1.242-1.67 3.023-1.67 2.208 0 3.863 1.444 3.863 4.547v5.152h-.001z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
