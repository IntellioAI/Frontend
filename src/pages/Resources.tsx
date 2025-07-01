export function Resources() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Resources</h1>
        <p className="text-gray-300 mb-8">Access comprehensive study materials, notes, and documentation.</p>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-400 mb-6">We're curating the best resources for your learning journey.</p>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium">
            Get Notified
          </button>
        </div>
      </div>
    </div>
  );
}