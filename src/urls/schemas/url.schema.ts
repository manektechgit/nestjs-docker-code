import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema()
export class Url {
  @Prop({ unique: true })
  shortUrl?: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: undefined })
  expireAt: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
UrlSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
