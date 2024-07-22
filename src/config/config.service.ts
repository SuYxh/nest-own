import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomConfigService {
  private readonly config: { [key: string]: any } = {
    apiUrl: 'http://example.com/api',
    apiKey: 'your-api-key',
  };

  get(key: string): any {
    return this.config[key];
  }
}
