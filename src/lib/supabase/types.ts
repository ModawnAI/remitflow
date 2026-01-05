export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string;
          email: string | null;
          full_name: string;
          kyc_tier: number;
          kyc_status: 'pending' | 'verified' | 'rejected' | 'expired';
          account_status: 'active' | 'suspended' | 'blocked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          email?: string | null;
          full_name: string;
          kyc_tier?: number;
          kyc_status?: 'pending' | 'verified' | 'rejected' | 'expired';
          account_status?: 'active' | 'suspended' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          email?: string | null;
          full_name?: string;
          kyc_tier?: number;
          kyc_status?: 'pending' | 'verified' | 'rejected' | 'expired';
          account_status?: 'active' | 'suspended' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
      };
      recipients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          bank_name: string;
          account_number: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          bank_name: string;
          account_number: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          bank_name?: string;
          account_number?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          recipient_id: string;
          amount_gbp: number;
          amount_ngn: number;
          exchange_rate: number;
          fee: number;
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          payment_method: string;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipient_id: string;
          amount_gbp: number;
          amount_ngn: number;
          exchange_rate: number;
          fee: number;
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          payment_method: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipient_id?: string;
          amount_gbp?: number;
          amount_ngn?: number;
          exchange_rate?: number;
          fee?: number;
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          payment_method?: string;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      transaction_events: {
        Row: {
          id: string;
          transaction_id: string;
          event_type: string;
          title: string;
          description: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          transaction_id: string;
          event_type: string;
          title: string;
          description: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          transaction_id?: string;
          event_type?: string;
          title?: string;
          description?: string;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      kyc_documents: {
        Row: {
          id: string;
          user_id: string;
          document_type: 'passport' | 'driving_licence' | 'national_id';
          document_url: string;
          selfie_url: string | null;
          status: 'pending' | 'approved' | 'rejected';
          review_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_type: 'passport' | 'driving_licence' | 'national_id';
          document_url: string;
          selfie_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          review_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_type?: 'passport' | 'driving_licence' | 'national_id';
          document_url?: string;
          selfie_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          review_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'support' | 'compliance' | 'viewer';
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'support' | 'compliance' | 'viewer';
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'support' | 'compliance' | 'viewer';
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fx_rates: {
        Row: {
          id: string;
          from_currency: string;
          to_currency: string;
          rate: number;
          markup: number;
          provider: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_currency: string;
          to_currency: string;
          rate: number;
          markup: number;
          provider: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_currency?: string;
          to_currency?: string;
          rate?: number;
          markup?: number;
          provider?: string;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      kyc_status: 'pending' | 'verified' | 'rejected' | 'expired';
      account_status: 'active' | 'suspended' | 'blocked';
      transaction_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
      document_type: 'passport' | 'driving_licence' | 'national_id';
      document_status: 'pending' | 'approved' | 'rejected';
      admin_role: 'admin' | 'support' | 'compliance' | 'viewer';
    };
  };
};

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Domain types
export type User = Tables<'users'>;
export type Recipient = Tables<'recipients'>;
export type Transaction = Tables<'transactions'>;
export type TransactionEvent = Tables<'transaction_events'>;
export type KycDocument = Tables<'kyc_documents'>;
export type AdminUser = Tables<'admin_users'>;
export type FxRate = Tables<'fx_rates'>;
export type Setting = Tables<'settings'>;
