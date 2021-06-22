import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateProductTable1624221039583 implements MigrationInterface {
    name = 'UpdateProductTable1624221039583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "quantity" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "quantity"`);
    }

}
