export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-light text-gray-900 mb-4">404</h1>
        <h2 className="text-xl text-gray-600 mb-6">Blog post not found</h2>
        <p className="text-gray-500 mb-8">
          The blog post you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Back to portfolio
        </a>
      </div>
    </div>
  );
}