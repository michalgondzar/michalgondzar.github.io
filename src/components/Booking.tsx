
import BookingForm from "./booking/BookingForm";
import PricingCard from "./booking/PricingCard";
import AvailabilityCalendar from "./AvailabilityCalendar";

const Booking = () => {
  return (
    <section id="rezervacia" className="section-container bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="section-title">Rezervácia</h2>
        <p className="section-subtitle">
          Rezervujte si váš pobyt v apartmáne Tília
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-1">
          <BookingForm />
        </div>
        <div className="lg:col-span-1">
          <AvailabilityCalendar />
        </div>
        <div className="lg:col-span-1">
          <PricingCard />
        </div>
      </div>
    </section>
  );
};

export default Booking;
