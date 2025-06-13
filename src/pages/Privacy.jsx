export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Data Collection</h2>
        <p className="mb-4">
          We use Google Analytics to collect anonymous usage statistics to help us understand how our service is used.
          No personal data is stored when you upload files - all processing happens in your browser.
        </p>
        <p>
          Uploaded files are processed client-side and never sent to our servers unless you explicitly choose to save your work.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Cookie Policy</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><strong>Essential Cookies:</strong> Required for basic functionality like maintaining your session</li>
          <li><strong>Analytics Cookies:</strong> Help us improve the service (Google Analytics)</li>
        </ul>
        <p>
          You can manage your cookie preferences using our cookie consent banner.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to ensure a level of security
          appropriate to the risk of processing your information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
        <p className="mb-4">
          Under GDPR and other privacy regulations, you have the right to:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Request access to any data we may have about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Withdraw consent for data processing</li>
        </ul>
        <p>
          To exercise these rights, please contact us at{' '}
          <a href="mailto:clueanalytics7@gmail.com" className="text-blue-600 hover:underline">
            clueanalytics7@gmail.com
          </a>.
        </p>
      </section>
    </div>
  );
}

