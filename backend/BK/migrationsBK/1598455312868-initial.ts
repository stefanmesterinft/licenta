import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1598455312868 implements MigrationInterface {
    name = 'initial1598455312868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "UQ_4da2db785b80a7db15c7f8efb72" UNIQUE ("device_number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "UQ_4da2db785b80a7db15c7f8efb72"`);
    }

}
