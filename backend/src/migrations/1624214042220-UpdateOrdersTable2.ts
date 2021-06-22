import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateOrdersTable21624214042220 implements MigrationInterface {
    name = 'UpdateOrdersTable21624214042220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "shipping" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shipping"`);
    }

}
