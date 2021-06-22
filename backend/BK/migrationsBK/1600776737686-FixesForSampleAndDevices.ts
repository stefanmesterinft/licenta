import {MigrationInterface, QueryRunner} from "typeorm";

export class FixesForSampleAndDevices1600776737686 implements MigrationInterface {
    name = 'FixesForSampleAndDevices1600776737686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0cd3cbe3def88548f1837a653a" ON "devices" ("barcode") WHERE barcode IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_487833551a5b667627a6d3cbd9" ON "samples" ("barcode") WHERE barcode IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_487833551a5b667627a6d3cbd9"`);
        await queryRunner.query(`DROP INDEX "IDX_0cd3cbe3def88548f1837a653a"`);
    }

}
