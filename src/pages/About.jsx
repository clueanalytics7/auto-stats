export default function About() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
      <div className="prose max-w-none">
        <p>
          Our mission is to make data analysis accessible to everyone without requiring
          advanced technical skills or expensive software.
        </p>
        <h2 className="mt-4">Features</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>100% client-side processing (your data never leaves your browser)</li>
          <li>No registration required</li>
          <li>Open-source foundation</li>
        </ul>
      </div>
    </div>
  );
}
