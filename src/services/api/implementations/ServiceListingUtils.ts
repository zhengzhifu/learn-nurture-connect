
import { ServiceFilters } from '../serviceClient';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export class ServiceListingUtils {
  static applyFilters(query: PostgrestFilterBuilder<any>, filters: ServiceFilters): PostgrestFilterBuilder<any> {
    // Apply price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (minPrice > 0) {
        query = query.gte('price', minPrice);
      }
      if (maxPrice < 200) {  // Assuming 200 is the max reasonable price
        query = query.lte('price', maxPrice);
      }
    }

    // Apply location filter if provided
    if (filters.location && filters.location !== 'All') {
      query = query.ilike('location', `%${filters.location}%`);
    }

    // Filter by subjects
    if (filters.subjects && filters.subjects.length > 0) {
      // This is a simplified approach. In a real app, this would be more complex
      // due to how arrays are queried in PostgreSQL
      query = query.or(
        filters.subjects.map(subject => `subjects.cs.{${subject}}`).join(',')
      );
    }

    // Apply service type filters if provided
    if (filters.types && filters.types.length > 0) {
      // Create an array of OR conditions for each type
      query = query.in('type', filters.types);
    }

    // Apply availability filters if provided
    if (filters.availability && filters.availability.length > 0) {
      // This is simplified. In a real app, you'd join with an availability table
      // or use array contains operations
      query = query.or(
        filters.availability.map(slot => `availability.cs.{${slot}}`).join(',')
      );
    }

    return query;
  }
}
