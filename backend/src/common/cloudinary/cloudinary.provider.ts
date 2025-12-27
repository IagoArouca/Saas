// src/common/cloudinary/cloudinary.provider.ts
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'seu_cloud_name',
      api_key: 'sua_api_key',
      api_secret: 'seu_api_secret',
    });
  },
};