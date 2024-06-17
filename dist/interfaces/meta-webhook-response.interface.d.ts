export interface IMetaWebhookResponse {
    id: string;
    status: string;
    timestamp: number;
    recipient_id: string;
    errors?: Array<{
        code: number;
        title: string;
        message: string;
        error_data?: {
            details: string;
        };
    }>;
    conversation?: {
        id: string;
        expiration_timestamp: number;
        origin: {
            type: string;
        };
    };
    pricing?: {
        billable: boolean;
        pricing_model: string;
        category: string;
    };
    taskId?: string;
}
