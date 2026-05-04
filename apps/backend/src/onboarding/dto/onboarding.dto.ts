export class CreateOnboardingDto {}
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SkillLevel } from '@prisma/client';

// ── One skill entry (offered or wanted) ───────────────────────────
export class SkillEntryDto {
  @IsUUID('all', { message: 'skillId must be a valid UUID' })
  skillId: string;

  @IsEnum(SkillLevel, {
    message: 'level must be: beginner, intermediate or advanced',
  })
  level: SkillLevel;
}

// ── Main onboarding body ──────────────────────────────────────────
export class OnboardingDto {
  // Step 1 — skills the user can teach
  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least 1 skill you can offer' })
  @ArrayMaxSize(5, { message: 'You can offer at most 5 skills' })
  @ValidateNested({ each: true })
  @Type(() => SkillEntryDto)
  skillsOffered: SkillEntryDto[];

  // Step 2 — skills the user wants to learn
  @IsArray()
  @ArrayMinSize(1, { message: 'Add at least 1 skill you want to learn' })
  @ArrayMaxSize(5, { message: 'You can want at most 5 skills' })
  @ValidateNested({ each: true })
  @Type(() => SkillEntryDto)
  skillsWanted: SkillEntryDto[];

  // Step 3 — basic info
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'City must be at most 100 characters' })
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(280, { message: 'Bio must be at most 280 characters' })
  bio?: string;

  // Avatar URL is optional — user uploads photo via POST /upload first,
  // then passes the returned URL here
  @IsOptional()
  @IsUrl({}, { message: 'avatarUrl must be a valid URL' })
  avatarUrl?: string;
}
