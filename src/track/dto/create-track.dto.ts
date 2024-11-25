import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
    @IsNotEmpty()
    data: any
    @IsNumber()
    count?: number
}
 