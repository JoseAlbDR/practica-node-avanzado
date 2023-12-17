import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { Uuid } from '../../../config';

export class FileUploadService {
  constructor(private readonly uuid = Uuid.v4) {}

  private makeFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
  }

  public async uploadSingle(file: UploadedFile, folder: string = 'uploads') {
    try {
      const destination = path.resolve(__dirname, '../../../', folder);
      this.makeFolder(destination);

      const fileExtension = file.mimetype.split('/').at(-1) ?? '';

      const fileName = `${this.uuid}.${fileExtension}`;

      file.mv(`${destination}/${fileName}`);

      return { fileName };
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }

  public async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'uploads'
  ) {
    const fileNames = await Promise.all(
      files.map((file) => this.uploadSingle(file, folder))
    );

    return fileNames;
  }
}