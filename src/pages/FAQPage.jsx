import Navbar from '../components/Navbar';
import FAQ from '../components/FAQ';
import './FAQPage.css';

function FAQPage() {
  return (
    <>
      <Navbar />
      <div className="faq-page">
        <FAQ />
      </div>
    </>
  );
}

export default FAQPage;