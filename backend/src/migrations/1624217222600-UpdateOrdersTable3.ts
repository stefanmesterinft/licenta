import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateOrdersTable31624217222600 implements MigrationInterface {
    name = 'UpdateOrdersTable31624217222600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_ac832121b6c331b084ecc4121fd"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "product_id" TO "products_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "quantity" integer array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_4945c6758fd65ffacda760b4ac9" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_4945c6758fd65ffacda760b4ac9"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "products_id" TO "product_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_ac832121b6c331b084ecc4121fd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
