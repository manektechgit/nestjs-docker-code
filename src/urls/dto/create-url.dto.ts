import { IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsOptional()
  @IsUrl()
  shortUrl?: string;

  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @IsNumber()
  expireAt?: number;
}
