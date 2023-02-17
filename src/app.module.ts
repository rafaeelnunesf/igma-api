import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config/config.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CustomersModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
