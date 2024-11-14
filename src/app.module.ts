import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { ServerController } from './server-manager/server.controller';
import { ServerService } from './server-manager/server.service';

@Module({
  imports: [ConfigModule.forRoot(), FirebaseModule],
  controllers: [ServerController],
  providers: [ServerService],
})
export class AppModule {}
