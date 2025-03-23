
import { ServiceType } from "@/types/service";

export interface FilterProps {
  selectedTypes: ServiceType[];
  setSelectedTypes: (types: ServiceType[]) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  selectedAvailability: string[];
  setSelectedAvailability: (availability: string[]) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const formatPriceRange = (range: [number, number]): string => {
  return `$${range[0]} - $${range[1]}`;
};
