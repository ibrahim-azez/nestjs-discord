import { MessageBuilder, Webhook } from 'discord-webhook-node';
import { of, RetryConfig, Subject, takeUntil } from 'rxjs';
import { retry, take, tap } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';

import { isExceptionObject } from './utils/is-exception-object';
import { isHttpError } from './utils/is-http-error';
import {
  DISCORD_WEBHOOK_URL,
  DiscordColor,
  DiscordNotificationProps,
  NODE_ENV,
} from './utils';

@Injectable()
export class DiscordService {
  private readonly webhook: Webhook;
  constructor(
    @Inject(DISCORD_WEBHOOK_URL)
    readonly webhookUrlOnEvent: string,
    @Inject(NODE_ENV)
    private readonly nodeEnv: string,
  ) {
    this.webhook = new Webhook(webhookUrlOnEvent);
  }

  async sendNotification(discordNotificationProps: DiscordNotificationProps) {
    const { processSignal, error, color, title, description } =
      discordNotificationProps;
    const hasSucceeded$ = new Subject<true>();

    const messageBuilder = new MessageBuilder().addField(
      'Environment',
      `${this.nodeEnv}`,
    );

    if (title || error) {
      messageBuilder.setTitle(title ?? 'An Error Has Occurred');
    }

    if (description) {
      messageBuilder.setTitle(description);
    }

    const body = isHttpError(error)
      ? {
          statusCode: error.statusCode,
        }
      : {};

    const newError = isExceptionObject(error)
      ? {
          name: error.name,
          stack: error.stack,
          message: error.message,
        }
      : {};

    const { stack, message, name } = newError;

    if (processSignal) {
      messageBuilder.addField('Process Signal', processSignal, true);
    }

    if (body.statusCode) {
      messageBuilder.addField('Status', String(body.statusCode), true);
    }

    if (name) {
      messageBuilder.addField('Error Name', name, true);
    }

    if (message) {
      messageBuilder.addField('Error Message', message, true);
    }

    if (stack) {
      messageBuilder.addField('Error Stack', stack);
    }

    let newColor: string | number = DiscordColor.error;
    if (color) {
      newColor = color;
    }

    const parsedNewColor =
      typeof newColor === 'number' ? newColor : parseInt(newColor, 16);

    if (Number.isNaN(parsedNewColor)) {
      throw new Error(`your Color ${parsedNewColor} should be HEX to be valid`);
    }

    messageBuilder.setColor(parsedNewColor).setTimestamp();

    let retryConfig: RetryConfig = {
      count: 2,
      delay: 5000,
    };

    if (discordNotificationProps.retryConfig) {
      if (typeof discordNotificationProps.retryConfig === 'number') {
        retryConfig = { count: discordNotificationProps.retryConfig };
      } else {
        retryConfig = discordNotificationProps.retryConfig;
      }
    }

    of(this.webhook.send(messageBuilder))
      .pipe(
        tap(() => {
          hasSucceeded$.next(true);
        }),
        retry(retryConfig),
        takeUntil(hasSucceeded$),
        take(retryConfig.count ?? 1),
      )
      .subscribe();
  }
}
