import {MigrationInterface, QueryRunner} from "typeorm";

export class CartTableUpdate21623339088894 implements MigrationInterface {
    name = 'CartTableUpdate21623339088894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_7d0e145ebd287c1565f15114a18"`);
        await queryRunner.query(`ALTER TABLE "carts" RENAME COLUMN "product_id" TO "product_id_id"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_b6542430467698fc52c515a279a" FOREIGN KEY ("product_id_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_b6542430467698fc52c515a279a"`);
        await queryRunner.query(`ALTER TABLE "carts" RENAME COLUMN "product_id_id" TO "product_id"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_7d0e145ebd287c1565f15114a18" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
