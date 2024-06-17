export interface IMetaWebhookResponse {
  id: string;
  status: string; // Union type for status
  timestamp: number;
  recipient_id: string;
  errors?: Array<{
    // Optional errors array
    code: number;
    title: string;
    message: string;
    error_data?: {
      // Optional error_data object
      details: string;
    };
  }>;
  conversation?: {
    // Optional conversation object
    id: string;
    expiration_timestamp: number;
    origin: {
      type: string; // Constant value for current data
    };
  };
  pricing?: {
    // Optional pricing object
    billable: boolean;
    pricing_model: string; // Constant value for current data
    category: string; // Constant value for current data
  };
  taskId?: string;
}
