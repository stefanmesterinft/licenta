
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const UploadStorageFilter = (): any => {
    return diskStorage({
        destination: (req, file, callback) => {    
            console.log(file);
                    
            const path = './uploads/products';

            if (!existsSync(path)) { 
                mkdirSync(path,'0777');
            }
            callback(null, path);
        },
        filename:  (req, file, callback) => {
            const name = file.originalname.split('.')[0];
            const fileExtName = extname(file.originalname);
            const randomName = Array(4)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            callback(null, `${name}-${randomName}${fileExtName}`);
        },
    });
};