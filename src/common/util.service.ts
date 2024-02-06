import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class UtilService {
  sendResponse(response: Response, status: HttpStatus, data: any) {
    response.status(status).send(data);
  }
}
