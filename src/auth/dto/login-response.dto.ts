import { TokensDto } from './tokens.dto';

export class LoginResponseDto {
  tokens: TokensDto;
  userName: string;
  email: string;
}
