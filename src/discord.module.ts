import { isURL } from 'class-validator';

import { DynamicModule, Global, Module } from '@nestjs/common';

import { DISCORD_BASE_URL, NODE_ENV } from './utils/constants';
import { DiscordOptions } from './utils/types';
import { DiscordService } from './discord.service';

@Global()
@Module({})
export class DiscordModule {
  static forRoot(options: DiscordOptions): DynamicModule {
    const { webhookUrl } = options;
    const isValidUrl =
      webhookUrl.startsWith(DISCORD_BASE_URL) && isURL(webhookUrl);

    if (!isValidUrl) {
      throw new Error(
        `Discord Url Must be a valid url and start with ${DISCORD_BASE_URL}`,
      );
    }

    return {
      module: DiscordModule,
      providers: [
        DiscordService,
        { provide: DISCORD_BASE_URL, useValue: options.webhookUrl },
        { provide: NODE_ENV, useValue: options.NODE_ENV },
      ],
      exports: [DiscordService],
    };
  }
}
