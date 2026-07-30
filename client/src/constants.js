export const KENYAN_CITIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];
export const VEHICLE_CATEGORIES = ["SUV", "Sedan", "Truck", "Convertible", "Van", "Limousine", "Hearse", "Safari", "Bus"];
export const VEHICLE_YEARS = Array.from({
  length: 2025 - 2010 + 1
}, (_, i) => 2010 + i).reverse();
export const VEHICLE_CONDITIONS = ["New", "Used"];
export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
export const TRANSMISSIONS = ["Automatic", "Manual"];
export const DRIVE_TYPES = ["FWD", "RWD", "AWD", "4WD"];
export const EXTERIOR_COLORS = ["White", "Black", "Silver", "Grey", "Blue", "Red", "Green", "Beige"];
export const MAX_MILEAGE_OPTIONS = [{
  label: "Under 20,000 km",
  value: 20000
}, {
  label: "Under 50,000 km",
  value: 50000
}, {
  label: "Under 100,000 km",
  value: 100000
}, {
  label: "Under 150,000 km",
  value: 150000
}];
export const VEHICLE_MAKE_MODELS = [{
  make: "Lincoln",
  model: "Town Car Limousine"
}, {
  make: "Rolls-Royce",
  model: "Funeral Hearse"
}, {
  make: "Toyota",
  model: "RAV4"
}, {
  make: "Nissan",
  model: "X-Trail"
}, {
  make: "Subaru",
  model: "Forester"
}, {
  make: "Honda",
  model: "CR-V"
}, {
  make: "Land Rover",
  model: "Range Rover"
}, {
  make: "Mercedes-Benz",
  model: "C-Class"
}, {
  make: "Volkswagen",
  model: "Golf"
}, {
  make: "Toyota",
  model: "Corolla"
}, {
  make: "Mazda",
  model: "Demio"
}, {
  make: "Toyota",
  model: "Hilux"
}, {
  make: "Ford",
  model: "Ranger"
}, {
  make: "Isuzu",
  model: "D-Max"
}, {
  make: "Toyota",
  model: "Hiace"
}, {
  make: "Nissan",
  model: "Urvan"
}, {
  make: "BMW",
  model: "4 Series"
}, {
  make: "Porsche",
  model: "911"
}, {
  make: "Bentley",
  model: "Continental GT"
}, {
  make: "Toyota",
  model: "Land Cruiser 70"
}, {
  make: "Toyota",
  model: "Land Cruiser Prado"
}, {
  make: "Toyota",
  model: "Land Cruiser 200"
}, {
  make: "Toyota",
  model: "Coaster Shuttle"
}, {
  make: "Toyota",
  model: "Coaster"
}, {
  make: "Scania",
  model: "Touring Coach"
}];
export const VEHICLE_MAKES = [...new Set(VEHICLE_MAKE_MODELS.map(m => m.make))].sort();
export const EVENT_TYPES = [{
  value: "wedding",
  label: "Wedding"
}, {
  value: "funeral",
  label: "Funeral"
}, {
  value: "safari",
  label: "Safari"
}, {
  value: "group_transportation",
  label: "Group transportation"
}, {
  value: "international_traveller",
  label: "International Traveller"
}, {
  value: "other",
  label: "Other"
}];
export const TRAVELLER_SERVICES = [{
  value: "airport_pickup",
  label: "Airport Pickup",
  description: "Be picked up from the airport and taken to your destination.",
  fields: {
    pickupLocation: false,
    dropoffLocation: true,
    meetAndGreet: true
  }
}, {
  value: "airport_dropoff",
  label: "Airport Drop-off",
  description: "Transport from your location to the airport.",
  fields: {
    pickupLocation: true,
    dropoffLocation: false,
    meetAndGreet: false
  }
}, {
  value: "round_trip",
  label: "Round-Trip Airport Transfer",
  description: "Book both an airport pickup and a return airport drop-off together.",
  fields: {
    pickupLocation: true,
    dropoffLocation: true,
    meetAndGreet: true
  }
}, {
  value: "hotel_transfer",
  label: "Hotel & Accommodation Transfer",
  description: "Airport to hotel, or hotel to airport.",
  fields: {
    pickupLocation: true,
    dropoffLocation: true,
    meetAndGreet: true
  }
}, {
  value: "tourist_transfer",
  label: "Tourist Destination Transfer",
  description: "Transfers to destinations such as Maasai Mara, Diani, Amboseli and more.",
  fields: {
    pickupLocation: true,
    dropoffLocation: true,
    meetAndGreet: false
  }
}, {
  value: "multi_day_driver",
  label: "Multi-Day Rental with Chauffeur",
  description: "A vehicle and chauffeur for several days of touring around the country.",
  fields: {
    pickupLocation: true,
    dropoffLocation: false,
    meetAndGreet: false
  }
}, {
  value: "multi_destination",
  label: "Multiple Destination Booking",
  description: "Airport, hotel, tourist attraction, hotel - list your stops in order in the notes below.",
  fields: {
    pickupLocation: true,
    dropoffLocation: true,
    meetAndGreet: false
  }
}];
export const EVENT_SUGGESTED_CATEGORIES = {
  wedding: ["Limousine", "Convertible", "SUV", "Sedan"],
  funeral: ["Hearse", "SUV", "Sedan", "Van"],
  safari: ["Safari", "SUV"],
  group_transportation: ["Bus", "Van"],
  international_traveller: ["Sedan", "SUV", "Van", "Limousine"],
  other: ["SUV", "Sedan", "Van", "Limousine", "Convertible", "Safari", "Bus", "Hearse", "Truck"]
};
function commonsUrl(filename, width = 1600) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${width}`;
}
export const EVENT_THEMES = {
  wedding: {
    bgImage: commonsUrl("Wedding_car_centrum_Fier_Albania_2018_1.jpg"),
    bgPosition: "80% 55%",
    gradient: "bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-transparent",
    textClass: "text-white",
    heading: "Plan your wedding convoy",
    body: "Limousines and premium cars for the bridal party, with a discount the more you book together."
  },
  funeral: {
    bgImage: commonsUrl("Lincoln_Town_Car_Hearse_(5356078140).jpg"),
    bgPosition: "78% 62%",
    gradient: "bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-transparent",
    textClass: "text-white",
    heading: "Arrange a funeral convoy",
    body: "A dignified hearse and accompanying vehicles, with experienced chauffeurs available."
  },
  safari: {
    bgImage: commonsUrl("Loxodonta_africana_group_surrounded_by_game_viewer_vehicles.jpg"),
    gradient: "bg-gradient-to-r from-emerald-950/90 via-emerald-900/55 to-transparent",
    textClass: "text-white",
    heading: "Book your safari fleet",
    body: "Land Cruisers built for game parks and reserves, in a range of trims and prices."
  },
  group_transportation: {
    bgImage: commonsUrl("Toyota_Coaster_Mini_Bus_2015.jpg"),
    gradient: "bg-gradient-to-r from-sky-950/90 via-sky-900/55 to-transparent",
    textClass: "text-white",
    heading: "Move your group together",
    body: "Buses and vans for school trips, staff transport, or large tour groups."
  },
  international_traveller: {
    bgImage: commonsUrl("Jomo_Kenyatta_International_Airport_(JKIA).jpg"),
    gradient: "bg-gradient-to-r from-indigo-950/90 via-indigo-900/55 to-transparent",
    textClass: "text-white",
    heading: "Arriving in Kenya? We'll be at the gate.",
    body: "Airport pickups, hotel transfers, and multi-day touring with an experienced chauffeur."
  },
  other: {
    bgImage: commonsUrl("Land_Rover_Range_Rover_P525_Autobiography_L405_black_(4).jpg"),
    gradient: "bg-gradient-to-r from-brand-navy-dark/90 via-brand-navy/60 to-transparent",
    textClass: "text-white",
    heading: "Book vehicles for your event",
    body: "Pick whatever mix of vehicles your event needs."
  }
};
export const CONVOY_DISCOUNT_TIERS = [{
  minVehicles: 6,
  discount: 0.15
}, {
  minVehicles: 4,
  discount: 0.10
}, {
  minVehicles: 2,
  discount: 0.05
}];
export function previewConvoyDiscount(vehicleCount) {
  for (const tier of CONVOY_DISCOUNT_TIERS) {
    if (vehicleCount >= tier.minVehicles) return tier.discount;
  }
  return 0;
}
export const AUTH_BG_IMAGES = [commonsUrl("Mercedes-Benz_W213_Facelift_IMG_3726.jpg"), commonsUrl("Toyota_Land_Cruiser_200_002.JPG"), commonsUrl("Rolls_Royce_Funeral_Hearse_(1).jpg"), commonsUrl("Toyota_Coaster_Mini_Bus_2015.jpg")];
export const LOGIN_BG_IMAGE = commonsUrl("Porsche_911_on_a_rainy_evening_(Unsplash).jpg", 1920);
export const PHONE_REGEX = /^\+254\d{9}$/;
export function isValidKenyanPhone(value) {
  return PHONE_REGEX.test(value || "");
}
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(value) {
  return EMAIL_REGEX.test((value || "").trim());
}
export const BOOKING_STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-700"
};