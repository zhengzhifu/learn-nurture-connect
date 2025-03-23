
import { ServiceType } from '@/types/service';

/**
 * Maps the service type string from the database to the ServiceType enum
 */
export const mapServiceType = (type: string): ServiceType => {
  if (type.includes('tutoring')) {
    return 'tutoring';
  } else if (type === 'babysitting') {
    return 'babysitting';
  } else {
    return 'tutoring'; // Default
  }
};

/**
 * Parses availability data from various formats into a string array
 */
export const parseAvailability = (availabilityJson: any): string[] => {
  try {
    if (Array.isArray(availabilityJson)) {
      return availabilityJson.map(item => item.toString());
    } else if (typeof availabilityJson === 'object') {
      // If it's a JSON object, extract values that might represent availability
      return Object.values(availabilityJson)
        .filter(Boolean)
        .map(item => item.toString());
    }
    return [];
  } catch (e) {
    console.error('Error parsing availability:', e);
    return [];
  }
};
