import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  async uploadImage(
    file: Express.Multer.File, 
    subfolder: string = 'geral'
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    
    this.logger.log(`--- INICIANDO UPLOAD [Pasta: ${subfolder}] ---`);

    if (!file.buffer || file.buffer.length === 0) {
      this.logger.error('O buffer do arquivo está vazio ou inexistente.');
      throw new BadRequestException('O arquivo enviado está corrompido ou vazio.');
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `mochila_dev/${subfolder}`,
        },
        (error, result) => {
          if (error) {
            this.logger.error('Erro retornado pelo Cloudinary:', error);
            return reject(error);
          }
          if (!result) {
            this.logger.error('Cloudinary não retornou erro, mas o resultado é nulo.');
            return reject(new Error('Resultado do upload indefinido.'));
          }
          
          this.logger.log(`Upload concluído com sucesso! URL: ${result.secure_url}`);
          resolve(result); 
        },
      );

      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}