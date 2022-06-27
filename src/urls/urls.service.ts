import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as CryptoJS from 'crypto-js';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url, UrlDocument } from './schemas/url.schema';
import * as moment from 'moment';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
  ) {}

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    const url = await this.findOneByOrinalUrl(createUrlDto.originalUrl);
    if (url) {
      return url;
    } else {
      const randomBytes = CryptoJS.lib.WordArray.random(6);
      if (!createUrlDto.shortUrl) {
        createUrlDto.shortUrl = `${
          process.env.TINYURL_HOST
        }/${randomBytes.toString(CryptoJS.enc.Base64url)}`;
      }

      const createData = {
        ...createUrlDto,
        expireAt: moment()
          .add(createUrlDto.expireAt ?? 1440, 'm')
          .toDate(),
      };

      const createdUrl = await this.urlModel.create(createData);
      return createdUrl;
    }
  }

  async findAll(): Promise<Url[]> {
    return this.urlModel.find().exec();
  }

  async findOne(shortUrl: string): Promise<Url> {
    return this.urlModel.findOne({ shortUrl }).exec();
  }

  async findOneByOrinalUrl(originalUrl: string): Promise<Url> {
    return this.urlModel.findOne({ originalUrl }).exec();
  }

  async delete(shortUrl: string) {
    const deletedUrl = await this.urlModel
      .findOneAndRemove({ shortUrl })
      .exec();
    return deletedUrl;
  }
}
