"use client";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { marked } from "marked";

// --- Article Modal Component ---
const ArticleModal = ({ post, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <header className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
      </header>
      <main className="p-8 overflow-y-auto">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: marked(post.fullContent) }}
        ></div>
      </main>
    </div>
  </div>
);

// --- Blog Post Card Component ---
const BlogPostCard = ({ post, onReadMore }) => (
  <div onClick={() => onReadMore(post)} className="block group cursor-pointer">
    <div className="overflow-hidden rounded-xl shadow-lg">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="bg-white p-6">
      <p className="text-sm font-semibold text-blue-600">{post.category}</p>
      <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
        {post.title}
      </h3>
      <p className="mt-3 text-gray-600">{post.description}</p>
    </div>
  </div>
);

// --- Main Blog Page Component ---
export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1506126613408-4e652a97b216?q=80&w=2940&auto=format&fit=crop",
      category: "Mindfulness",
      title: "The Power of a 5-Minute Meditation for ADHD",
      description:
        "Discover how a short daily mindfulness practice can dramatically improve focus and reduce impulsivity.",
      fullContent: `...`,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2874&auto=format&fit=crop",
      category: "Productivity",
      title: "Taming the To-Do List: Strategies for ADHD",
      description:
        "Feeling overwhelmed by your tasks? Learn three actionable strategies to prioritize, organize, and conquer your to-do list.",
      fullContent: `...`,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2900&auto=format&fit=crop",
      category: "Relationships",
      title: "Communicating Your Needs with ADHD",
      description:
        "Learn effective communication techniques to help your partners, friends, and colleagues understand your perspective.",
      fullContent: `...`,
    },
  ];

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="bg-gray-50">
      {/* --- Hero Section --- */}
      <div className="py-24 sm:py-32 text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Insights for a Focused Life
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Articles, strategies, and stories to help you navigate the world of
            ADHD with confidence and clarity.
          </p>
        </div>
      </div>

      {/* --- Featured Post Section --- */}
      <div className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            onClick={() => setSelectedPost(featuredPost)}
            className="block group cursor-pointer"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <p className="text-base font-semibold text-blue-600">
                  {featuredPost.category}
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  {featuredPost.description}
                </p>
                <span className="mt-6 inline-flex items-center font-semibold text-blue-600 group-hover:underline">
                  Read Full Story{" "}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- All Posts Section --- */}
      <div className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {otherPosts.map((post, index) => (
              <BlogPostCard
                key={index}
                post={post}
                onReadMore={setSelectedPost}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedPost && (
        <ArticleModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
