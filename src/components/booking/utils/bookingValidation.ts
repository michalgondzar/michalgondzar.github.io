
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
  
  if (!selectedStay) {
    return "Prosím vyberte typ pobytu";
  }
  
  return null;
};
