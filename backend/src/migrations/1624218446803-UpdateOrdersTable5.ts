import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateOrdersTable51624218446803 implements MigrationInterface {
    name = 'UpdateOrdersTable51624218446803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_4945c6758fd65ffacda760b4ac9"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "products_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "products_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_4945c6758fd65ffacda760b4ac9" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
