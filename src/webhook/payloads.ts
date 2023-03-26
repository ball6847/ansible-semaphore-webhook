import { IsObject, IsOptional } from "class-validator";

export class TriggerPayload {
  @IsObject()
  @IsOptional()
  environment?: Record<string, unknown> = {};
}
