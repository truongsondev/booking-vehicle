import { Inject, Injectable } from '@nestjs/common';

import { writeFile, readFile, access } from 'fs/promises';

@Injectable()
export class DbService {
  @Inject('DB_OPTIONS')
  private readonly options: { path: string };

  async write(obj: Record<string, any>) {
    await writeFile(this.options.path, JSON.stringify(obj || []), {
      encoding: 'utf8',
    });
  }

  async read() {
    try {
      const path = this.options.path;
      await access(path);
      const data = await readFile(path, { encoding: 'utf8' });
      const JSData = JSON.parse(data);
      return Array.isArray(JSData) ? JSData : [];
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }
}
