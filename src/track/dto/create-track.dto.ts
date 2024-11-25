import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTrackDto {
    @IsNotEmpty()
    data: any
    @IsNumber()
    @IsOptional()
    count?: number
}
 