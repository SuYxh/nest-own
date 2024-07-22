import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VerificationCodeService {
  private codes: Map<string, { code: string; timestamp: number }> = new Map();

  generateCode(email: string): string {
    const code = uuidv4().substr(0, 6);
    this.codes.set(email, { code, timestamp: Date.now() });
    return code;
  }

  validateCode(email: string, code: string): boolean {
    const storedCode = this.codes.get(email);
    if (!storedCode) {
      console.log('No code found for email');
      return false;
    }

    const now = Date.now();
    const isValid =
      storedCode.code === code && now - storedCode.timestamp <= 5 * 60 * 1000;

    if (isValid) {
      this.codes.delete(email);
    }

    return isValid;
  }
}
