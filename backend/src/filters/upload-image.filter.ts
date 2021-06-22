import { BadRequestException } from '@nestjs/common';

export const UploadImageFilter = (req, file, callback) => {
        if (
            !file.originalname.match(
                /\.(ai|bmp|ico|ps|psd|svg|tif|tiffjpg|jpeg|jpg|JPG|png|gif|jfif|aif|cda|mid|midi|mp3|mpa|ogg|wav|wma|wpl|7z|arj|deb|pkg|rar|rpm|tar|gz|z|zip|bin|dmg|iso|toast|vcd|csv|xml|key|odp|pps|ppy|pptx|ods|xls|xlsm|xlsx|3g2|3gp|avi|flv|h264|m4v|mkv|mov|mp4|mpg|mpeg|rm|swf|vob|wmv|doc|docx|odt|pdf|rtf|tex|txt|wpd)$/,
            )
        ) {
            return callback(
                new BadRequestException(
                    'error.upload.file_externsion_not_allowed',
                ),
                false,
            );
        }
    callback(null, true);
};