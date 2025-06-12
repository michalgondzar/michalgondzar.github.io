
export const validateBookingForm = (
  checkIn: string,
  checkOut: string,
  name: string,
  email: string,
  selectedStay: string
) => {
  if (!checkIn || !checkOut || !name || !email) {
    return "Prosím vyplňte všetky povinné polia";
  }
  
  // Remove stay type validation - it's no longer required
  
  return null;
};
