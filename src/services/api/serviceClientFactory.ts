
import { ServiceClient } from './serviceClient';
import { mockServiceClient } from './mockServiceClient';
import { realServiceClient } from './realServiceClient';

// Environment configuration - can be expanded to read from env variables
const useMock = process.env.NODE_ENV === 'test' || false;

/**
 * Factory class to manage and provide access to service client implementations
 * Helps switch between mock and real implementations
 */
export class ServiceClientFactory {
  // Use the appropriate client based on environment
  private static instance: ServiceClient = useMock ? mockServiceClient : realServiceClient;
  
  // Get the current client instance
  static getClient(): ServiceClient {
    console.log('ServiceClientFactory: getClient called, returning:', 
      this.instance === mockServiceClient ? 'mockServiceClient' : 'realServiceClient');
    return this.instance;
  }
  
  // Set a different client implementation
  static setClient(client: ServiceClient): void {
    console.log('ServiceClientFactory: setClient called, switching to:', 
      client === mockServiceClient ? 'mockServiceClient' : 'realServiceClient');
    this.instance = client;
  }

  // Enable mock mode (useful for testing or development)
  static enableMockMode(): void {
    console.log('ServiceClientFactory: Enabling mock mode');
    this.instance = mockServiceClient;
  }

  // Enable real mode (production mode with actual API calls)
  static enableRealMode(): void {
    console.log('ServiceClientFactory: Enabling real mode');
    this.instance = realServiceClient;
  }

  // Toggle between mock and real modes
  static toggleMode(): ServiceClient {
    if (this.instance === mockServiceClient) {
      this.enableRealMode();
    } else {
      this.enableMockMode();
    }
    return this.instance;
  }
}
