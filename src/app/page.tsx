export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">SchoolSaaS</h1>
          <p className="text-xl text-primary-200 mb-8">
            Multi-School Management System
          </p>
          <a
            href="/login"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
