import { Role } from '../enums/role.enum';

export class AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isOnboarded: boolean;
    avatarUrl?: string | null;
  };
}
