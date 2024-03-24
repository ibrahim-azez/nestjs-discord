import { RetryConfig } from 'rxjs';

export type DiscordOptions = {
  webhookUrl: string;
  NODE_ENV: string;
};

export const DiscordColor = {
  error: 'e32b2b',
  success: '4ae32b',
  warning: 'e37e2b',
} as const;

export type DiscordNotificationProps = {
  processSignal?: string;
  error?: unknown;
  title?: string;
  description?: string;
  color?: string | number;
  retryConfig?: RetryConfig | number;
};
