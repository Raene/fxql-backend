import { ConfigService } from '@nestjs/config';

export function CheckRequiredEnvVariables(
  configService: ConfigService,
  requiredVars: string[],
): void {
  const missingVars = requiredVars.filter(
    (varName) => !configService.get(varName),
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }
}
