import { PartialType } from '@nestjs/swagger';
import { CreateMatchPlayerDto } from './create-match-player.dto';

export class UpdateMatchPlayerDto extends PartialType(CreateMatchPlayerDto) {} 