
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
        // Create a proper composite client by extending the real service client
        // and overriding specific methods with edge function implementations
        return {
          // Include all methods from realServiceClient for profile and review operations
          ...realServiceClient,
          
          // Override service-related methods with edge function implementations
          getServices: edgeFunctionServiceClient.getServices.bind(edgeFunctionServiceClient),
          filterServices: edgeFunctionServiceClient.filterServices.bind(edgeFunctionServiceClient),
          searchServices: edgeFunctionServiceClient.searchServices.bind(edgeFunctionServiceClient)
        };
      default:
        return mockServiceClient;
    }
  }
}
