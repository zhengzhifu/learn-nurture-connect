
import { BaseService } from '../base/BaseService';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';

/**
 * Base class for profile-related services with common utilities
 */
export abstract class ProfileServiceBase extends BaseService {
  /**
   * Handles common profile errors and displays toast messages
   */
  protected handleProfileError(error: any, operation: string): never {
    console.error(`Error ${operation} profile:`, error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.details) console.error('Error details:', error.details);
    
    toast.error(`Failed to ${operation} profile: ${error.message}`);
    throw error;
  }

  /**
   * Creates a standardized Profile object from database data
   */
  protected standardizeProfile(data: any): Profile {
    const profile: Profile = {
      id: data.id || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      user_type: data.user_type || 'parent',
      phone: data.phone || '',
      avatar_url: data.avatar_url || '',
      home_address: data.home_address || '',
      approval_status: data.approval_status || 'pending',
      school_id: data.school_id || '',
      latitude: data.latitude,
      longitude: data.longitude,
      // Add empty strings for fields that might not exist in the database
      other_school_name: '',
      verified: false,
      // Add derived full_name for backward compatibility
      full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim()
    };
    
    return profile;
  }
}
