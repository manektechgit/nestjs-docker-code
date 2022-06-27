import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './schemas/url.schema';
import { UrlsService } from './urls.service';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto) {
    return await this.urlsService.create(createUrlDto);
  }

  @Get()
  async findAll(): Promise<Url[]> {
    return this.urlsService.findAll();
  }

  @Get(':shortUrl')
  async findOne(@Param('shortUrl') shortUrl: string): Promise<Url> {
    return this.urlsService.findOne(shortUrl);
  }

  @Delete(':shortUrl')
  async delete(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.delete(shortUrl);
  }
}
