
import { ServiceClient } from './serviceClient';
import { mockServiceClient } from './mockServiceClient';
import { realServiceClient } from './realServiceClient';
import { edgeFunctionServiceClient } from './implementations/EdgeFunctionServiceClient';

type ServiceClientType = 'mock' | 'real' | 'edge';

export class ServiceClientFactory {
  // Default to edge function client for production, mock for development
  private static clientType: ServiceClientType = import.meta.env.PROD ? 'edge' : (import.meta.env.VITE_USE_MOCK_DATA === 'true' ? 'mock' : 'edge');
  
  static setClientType(type: ServiceClientType): void {
    this.clientType = type;
    console.log(`ServiceClientFactory: Client type set to ${type}`);
  }
  
  static getClient(): ServiceClient {
    console.log(`ServiceClientFactory: Getting client of type ${this.clientType}`);
    
    switch (this.clientType) {
      case 'mock':
        return mockServiceClient;
      case 'real':
        return realServiceClient;
      case 'edge':
        // For the edge function client, we'll wrap it in the real service client
        // and override just the methods we need
        const client = { ...realServiceClient };
        
        // Override the methods with edge function implementations
        client.getServices = edgeFunctionServiceClient.getServices.bind(edgeFunctionServiceClient);
        client.filterServices = edgeFunctionServiceClient.filterServices.bind(edgeFunctionServiceClient);
        client.searchServices = edgeFunctionServiceClient.searchServices.bind(edgeFunctionServiceClient);
        
        return client;
      default:
        return mockServiceClient;
    }
  }
}
