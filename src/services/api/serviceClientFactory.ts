
import { ServiceClient } from './serviceClient';
import { mockServiceClient } from './mockServiceClient';
import { realServiceClient } from './realServiceClient';

// This factory will help us switch between mock and real implementations
export class ServiceClientFactory {
  // Use the mock client by default for development
  private static instance: ServiceClient = mockServiceClient;
  
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
}
