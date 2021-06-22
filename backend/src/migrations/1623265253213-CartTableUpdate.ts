import {MigrationInterface, QueryRunner} from "typeorm";

export class CartTableUpdate1623265253213 implements MigrationInterface {
    name = 'CartTableUpdate1623265253213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_2fb47cbe0c6f182bb31c66689e9"`);
        await queryRunner.query(`ALTER TABLE "carts" RENAME COLUMN "cart_id" TO "product_id"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_7d0e145ebd287c1565f15114a18" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_7d0e145ebd287c1565f15114a18"`);
        await queryRunner.query(`ALTER TABLE "carts" RENAME COLUMN "product_id" TO "cart_id"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_2fb47cbe0c6f182bb31c66689e9" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
