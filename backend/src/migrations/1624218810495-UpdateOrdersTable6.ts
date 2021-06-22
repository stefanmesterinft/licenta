import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateOrdersTable61624218810495 implements MigrationInterface {
    name = 'UpdateOrdersTable61624218810495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders_products_products" ("orders_id" uuid NOT NULL, "products_id" uuid NOT NULL, CONSTRAINT "PK_9f1d0477b1eac620914984ed360" PRIMARY KEY ("orders_id", "products_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b658e2ff0fdbcd427e1d01d033" ON "orders_products_products" ("orders_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8bdf376e0e7952756b0cef732b" ON "orders_products_products" ("products_id") `);
        await queryRunner.query(`ALTER TABLE "orders_products_products" ADD CONSTRAINT "FK_b658e2ff0fdbcd427e1d01d0330" FOREIGN KEY ("orders_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_products_products" ADD CONSTRAINT "FK_8bdf376e0e7952756b0cef732bd" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products_products" DROP CONSTRAINT "FK_8bdf376e0e7952756b0cef732bd"`);
        await queryRunner.query(`ALTER TABLE "orders_products_products" DROP CONSTRAINT "FK_b658e2ff0fdbcd427e1d01d0330"`);
        await queryRunner.query(`DROP INDEX "IDX_8bdf376e0e7952756b0cef732b"`);
        await queryRunner.query(`DROP INDEX "IDX_b658e2ff0fdbcd427e1d01d033"`);
        await queryRunner.query(`DROP TABLE "orders_products_products"`);
    }

}
