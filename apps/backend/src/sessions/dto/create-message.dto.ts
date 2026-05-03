import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isMeetingLinkSuggestion?: boolean;
}
