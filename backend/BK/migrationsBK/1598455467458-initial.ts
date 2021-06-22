import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1598455467458 implements MigrationInterface {
    name = 'initial1598455467458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" RENAME COLUMN "device_number" TO "identifier"`);
        await queryRunner.query(`ALTER TABLE "devices" RENAME CONSTRAINT "UQ_4da2db785b80a7db15c7f8efb72" TO "UQ_01157b829735c0b390f3bbab1c0"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" RENAME CONSTRAINT "UQ_01157b829735c0b390f3bbab1c0" TO "UQ_4da2db785b80a7db15c7f8efb72"`);
        await queryRunner.query(`ALTER TABLE "devices" RENAME COLUMN "identifier" TO "device_number"`);
    }

}
