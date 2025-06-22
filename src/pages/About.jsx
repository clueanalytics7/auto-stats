

export default function About() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About EdgeChart</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700">
          At EdgeChart, we believe data should be easy to understand and accessible to everyone. Our mission is to empower individuals and teams to visualise and analyse their data effortlessly—without needing advanced technical skills, expensive software, or cloud uploads. By processing everything locally on your device, we ensure your data stays private and secure.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Why EdgeChart?</h2>
        <p className="text-gray-700">
          EdgeChart is designed for simplicity and trust. Whether you're a small business owner, a researcher, or a curious individual, our tool transforms your CSV data into clear, interactive charts right in your browser. No servers, no uploads, just fast and secure data visualisation.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Key Features</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>100% Client-Side Processing:</strong> Your data never leaves your device, ensuring maximum privacy and security.</li>
          <li><strong>No Registration Needed:</strong> Start analysing your data instantly—no accounts or sign-ups required.</li>
          <li><strong>Open-Source Foundation:</strong> Built on transparent, community-driven code for reliability and trust.</li>
          <li><strong>Intuitive Chart Building:</strong> Create stunning visualisations with a few clicks, no coding needed.</li>
          <li><strong>Lightweight and Fast:</strong> Runs smoothly on any modern browser, even with large datasets.</li>
        </ul>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Our Vision</h2>
        <p className="text-gray-700">
          Our team is passionate about democratising data analysis. We’re committed to maintaining EdgeChart as an open-source project, fostering a community of users and contributors who share our vision of accessible, secure, and powerful data tools. By keeping everything on the edge, we prioritise your control over your data.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Get Started Today</h2>
        <p className="text-gray-700">
          Ready to unlock insights from your data? Head to our <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a> to start visualising your CSV files with EdgeChart. Have questions or feedback? Visit our <a href="/contact" className="text-blue-600 hover:underline">Contact</a> page—we’d love to hear from you!
        </p>
      </div>
    </div>
  );
}
