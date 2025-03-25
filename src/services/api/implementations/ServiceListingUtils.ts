
import { ServiceFilters } from '../serviceClient';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export class ServiceListingUtils {
  static applyTutorFilters(query: any, filters: ServiceFilters): any {
    // Apply price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (minPrice > 0) {
        query = query.gte('hourly_rate', minPrice);
      }
      if (maxPrice < 200) {  // Assuming 200 is the max reasonable hourly rate
        query = query.lte('hourly_rate', maxPrice);
      }
    }

    // Apply location filter if provided
    if (filters.location && filters.location !== 'All') {
      // This would be more complex in a real app with geolocation
      // For now we'll just match on a simple string
      query = query.ilike('profiles.home_address', `%${filters.location}%`);
    }

    // Filter by subjects (this would typically join with a specialties table)
    if (filters.subjects && filters.subjects.length > 0) {
      // This is a simplified approach - in a real app, you'd join with a subjects/specialties table
      const subjectConditions = filters.subjects.map(
        subject => `specialty_name.ilike.%${subject}%`
      );
      query = query.or(subjectConditions.join(','));
    }

    // Apply service type filters if provided
    if (filters.types && filters.types.length > 0) {
      // In a real app, this would filter on a service_type column
      // For simplicity, we're not implementing this in this example
    }

    // Apply availability filters if provided
    if (filters.availability && filters.availability.length > 0) {
      // This would typically join with an availability table
      // For simplicity, we're not implementing this in this example
    }

    return query;
  }
}
