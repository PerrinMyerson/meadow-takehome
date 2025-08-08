export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Meadow Movie Email Service
        </h1>
        <p className="text-gray-600 mb-6">
          An Inngest-powered service that fetches movie data and sends email summaries.
        </p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h2 className="font-semibold text-blue-900 mb-2">API Endpoint</h2>
            <code className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
              POST /api/movie
            </code>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h2 className="font-semibold text-green-900 mb-2">Event</h2>
            <code className="text-sm text-green-800 bg-green-100 px-2 py-1 rounded">
              meadow_api/movie.watched
            </code>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
            <h2 className="font-semibold text-purple-900 mb-2">Inngest Dev Server</h2>
            <a 
              href="http://localhost:8288" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-purple-800 bg-purple-100 px-2 py-1 rounded hover:bg-purple-200"
            >
              http://localhost:8288
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
