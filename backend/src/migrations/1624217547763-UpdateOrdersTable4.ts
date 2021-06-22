import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateOrdersTable41624217547763 implements MigrationInterface {
    name = 'UpdateOrdersTable41624217547763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "order_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "order_id" character varying NOT NULL`);
    }

}
