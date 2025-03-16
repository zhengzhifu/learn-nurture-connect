
import { ServiceClient } from './serviceClient';
import { mockServiceClient } from './mockServiceClient';

// This factory will help us switch between mock and real implementations
export class ServiceClientFactory {
  private static instance: ServiceClient = mockServiceClient;
  
  // Get the current client instance
  static getClient(): ServiceClient {
    return this.instance;
  }
  
  // Set a different client implementation (for future real API usage)
  static setClient(client: ServiceClient): void {
    this.instance = client;
  }
}
