import { Vehicle } from "@/types/vehicle";

export const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Mercedes-Benz G-Class",
    category: "LUXURY",
    pricePerDay: 45000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "Unlimited",
    minimumHirePeriod: "2 days",
    engine: "4.0L V8",
    enginePower: "577 HP",
    engineTorque: "850 Nm",
    fuelEconomy: {
      city: "13 km/L",
      highway: "18 km/L"
    },
    available: true,
    features: ["4WD", "Leather Interior", "Navigation", "Parking Sensors"]
  },
  {
    id: "2",
    name: "Range Rover Vogue",
    category: "LUXURY",
    pricePerDay: 45000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1606611013016-969607c2c9ab?q=80&w=1200",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Diesel",
    mileage: "Unlimited",
    minimumHirePeriod: "2 days",
    engine: "3.0L V6",
    enginePower: "350 HP",
    engineTorque: "700 Nm",
    fuelEconomy: {
      city: "11 km/L",
      highway: "15 km/L"
    },
    available: true,
    features: ["4WD", "Panoramic Roof", "Massage Seats", "Premium Sound"]
  },
  {
    id: "3",
    name: "Lexus LX-570",
    category: "LUXURY",
    pricePerDay: 40000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1200",
    seats: 7,
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "Unlimited",
    minimumHirePeriod: "2 days",
    engine: "5.7L V8",
    enginePower: "367 HP",
    engineTorque: "530 Nm",
    fuelEconomy: {
      city: "10 km/L",
      highway: "14 km/L"
    },
    available: true,
    features: ["4WD", "Cooled Seats", "Adaptive Cruise", "Mark Levinson Audio"]
  },
  {
    id: "4",
    name: "BMW 7 Series",
    category: "EXECUTIVE",
    pricePerDay: 35000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Hybrid",
    mileage: "Unlimited",
    minimumHirePeriod: "1 day",
    engine: "3.0L I6",
    enginePower: "335 HP",
    engineTorque: "450 Nm",
    fuelEconomy: {
      city: "12 km/L",
      highway: "17 km/L"
    },
    available: true,
    features: ["Rear Entertainment", "Executive Lounge Seating", "Gesture Control"]
  },
  {
    id: "5",
    name: "Audi Q8",
    category: "LUXURY",
    pricePerDay: 38000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1200",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "Unlimited",
    minimumHirePeriod: "1 day",
    engine: "3.0L V6",
    enginePower: "335 HP",
    engineTorque: "500 Nm",
    fuelEconomy: {
      city: "11.5 km/L",
      highway: "16 km/L"
    },
    available: true,
    features: ["Quattro AWD", "Virtual Cockpit", "Matrix LED", "Bang & Olufsen"]
  },
  {
    id: "6",
    name: "Porsche Cayenne",
    category: "SPORT",
    pricePerDay: 42000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "Unlimited",
    minimumHirePeriod: "2 days",
    engine: "3.0L V6",
    enginePower: "340 HP",
    engineTorque: "450 Nm",
    fuelEconomy: {
      city: "10.5 km/L",
      highway: "14.5 km/L"
    },
    available: true,
    features: ["Sport Chrono", "PASM", "Air Suspension", "Burmester Sound"]
  }
];
