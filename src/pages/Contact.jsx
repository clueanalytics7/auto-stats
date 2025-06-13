export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">General Inquiries</h2>
        <p className="mb-4">
          For any questions or support needs, please email us at:
        </p>
        <a 
          href="mailto:clueanalytics7@gmail.com" 
          className="text-blue-600 hover:underline"
        >
          clueanalytics7@gmail.com
        </a>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Data Requests</h2>
        <p>
          Under GDPR, you have the right to request access to or deletion of any data we may have.
          Please contact us at the email above with "Data Request" in the subject line.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Feedback</h2>
        <p>
          We welcome any feedback or suggestions for improving our service.
          Don't hesitate to reach out!
        </p>
      </section>
    </div>
  );
}
