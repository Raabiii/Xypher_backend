import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { DocumentData } from 'firebase/firestore';

@Controller('username')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('createDocument')
  async createDocument(@Body() data: { collection: string; data: any }) {
    const { collection, data: documentData } = data;
    const docId = await this.firebaseService.createDocument(
      collection,
      documentData,
    );
    return { docId };
  }

  @Get('getDocument/:collection/:docId')
  async getDocument(
    @Param('collection') collection: string,
    @Param('docId') docId: string,
  ) {
    const doc = await this.firebaseService.getDocument(collection, docId);
    return doc;
  }

  @Post('isUsernameAvailable')
  async usernameAvailable(@Body('username') username: string) {
    const collections: DocumentData =
      await this.firebaseService.getCollections();
    let isAvailable = true;
    collections.forEach((collection) => {
      if (collection.name === username) {
        isAvailable = false;
      }
    });
    return isAvailable;
  }

  @Post('register')
  async createUsername(@Body('username') username: string) {
    const docId = await this.firebaseService.createUser(username, {
      friends: [],
      x: 0,
      y: 0,
      inventory: [],
    });
    return { docId };
  }

  @Post('getUserData')
  async getUserData(@Body() data: { username: string; serverName: string }) {
    const doc = await this.firebaseService.getPlayerData(
      data.serverName,
      data.username,
    );
    return doc;
  }
}
