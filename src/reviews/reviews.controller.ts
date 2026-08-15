import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';

import { CreateReviewDto } from './dto/create-review.dto';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('CUSTOMER')
  create(
    @Req() req: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(
      req.user.userId,
      dto,
    );
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('barber/:barberId')
  findBarberReviews(
    @Param('barberId') barberId: string,
  ) {
    return this.reviewsService.findBarberReviews(
      barberId,
    );
  }
}