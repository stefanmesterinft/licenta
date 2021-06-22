import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateOrdersTable1624213146052 implements MigrationInterface {
    name = 'UpdateOrdersTable1624213146052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "product_code"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "product_size"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "product_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_ac832121b6c331b084ecc4121fd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_ac832121b6c331b084ecc4121fd"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "product_size" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "product_code" character varying NOT NULL`);
    }

}
