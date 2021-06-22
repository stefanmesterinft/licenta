import { BadRequestException } from '@nestjs/common';

export const UploadCsvFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(csv)$/)) {
        return callback(new BadRequestException('error.upload.only_csv_allowed'), false);
    }
    callback(null, true);
};