import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductTableUpdate1623254183858 implements MigrationInterface {
    name = 'ProductTableUpdate1623254183858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "code" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "code"`);
    }

}
