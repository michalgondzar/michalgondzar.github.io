
import BookingForm from "./booking/BookingForm";
import PricingCard from "./booking/PricingCard";

const Booking = () => {
  return (
    <section id="rezervacia" className="section-container bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="section-title">Rezervácia</h2>
        <p className="section-subtitle">
          Rezervujte si váš pobyt v apartmáne Tília
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Booking Form and Pricing Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BookingForm />
          <PricingCard />
        </div>
      </div>
    </section>
  );
};

export default Booking;
