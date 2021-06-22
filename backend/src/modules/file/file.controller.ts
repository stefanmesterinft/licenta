'use strict';

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOkResponse,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { RolesGuard } from 'guards/roles.guard';

import { RoleType } from '../../common/constants/role-type';
import { Roles } from '../../decorators/roles.decorator';
import { FileDto } from './dto/File.dto';
import { FileCreateDto } from './dto/FileCreate.dto';
import { FilePageDto } from './dto/FilesPage.dto';
import { FilePageOptionsDto } from './dto/FilesPageOptions.dto';
import { FileService } from './file.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { FileUpdateDto } from './dto/FileUpdate.dto';
import { UserEntity } from 'modules/user/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadStorageFilter } from 'filters/upload-storage.filter';
import { UploadImageFilter } from 'filters/upload-image.filter';

@Controller('files')
@ApiTags('files')
@ApiBearerAuth()
export class FileController {
    constructor(private _fileService: FileService) {}

    @Get('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of file',
        type: FilePageDto,
    })
    getFiles(
        @Query() pageOptionsDto: FilePageOptionsDto,
    ): Promise<FilePageDto> {
        return this._fileService.getFiles(pageOptionsDto);
    }

    @Post('')
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: Boolean,
        description: 'Successfully Created',
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: UploadStorageFilter(),
            fileFilter: UploadImageFilter,
        }),
    )
    async createFile(
        @UploadedFile() uploadedFile,
        @Body() fileDto: FileCreateDto,
    ): Promise<FileDto> {
        if (uploadedFile && uploadedFile.filename) {
            fileDto.file = `products/${uploadedFile.filename}`;
        }

        const file = await this._fileService.createFile(fileDto);

        if (!file) {
            throw new NotFoundException();
        }
        return file.toDto();
    }

    @Get('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: FileDto, description: 'Requested file' })
    @ApiParam({
        name: 'id',
        description: 'File identifier',
        type: 'string',
    })
    async getFile(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity,
    ): Promise<FileDto> {
        const file = await this._fileService.findById(id, authUser);

        if (!file) {
            throw new NotFoundException();
        }

        return file.toDto();
    }

    @Put('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: FileDto, description: 'Successfully Updated' })
    @ApiParam({
        name: 'id',
        description: 'File identifier',
        type: 'string',
    })
    async updateFile(
        @Param('id') id: string,
        @Body() fileDto: FileUpdateDto,
        @AuthUser() authUser: UserEntity,
    ): Promise<FileDto> {
        const updatedFile = await this._fileService.updateFile(
            id,
            fileDto,
            authUser,
        );
        return updatedFile.toDto();
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({
        name: 'id',
        description: 'File identifier',
        type: 'string',
    })
    async deleteFile(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity,
    ): Promise<boolean> {
        return this._fileService.deleteFile(id, authUser);
    }
}