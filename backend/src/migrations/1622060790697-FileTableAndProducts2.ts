import {MigrationInterface, QueryRunner} from "typeorm";

export class FileTableAndProducts21622060790697 implements MigrationInterface {
    name = 'FileTableAndProducts21622060790697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products_image_files" ("products_id" uuid NOT NULL, "files_id" uuid NOT NULL, CONSTRAINT "PK_7fc1b5053eee5cf79a3ff021229" PRIMARY KEY ("products_id", "files_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_66c32f3cb7664576dfb60b4a1e" ON "products_image_files" ("products_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b124e0918ce6f002c194dd79b1" ON "products_image_files" ("files_id") `);
        await queryRunner.query(`ALTER TABLE "products_image_files" ADD CONSTRAINT "FK_66c32f3cb7664576dfb60b4a1e3" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_image_files" ADD CONSTRAINT "FK_b124e0918ce6f002c194dd79b19" FOREIGN KEY ("files_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_image_files" DROP CONSTRAINT "FK_b124e0918ce6f002c194dd79b19"`);
        await queryRunner.query(`ALTER TABLE "products_image_files" DROP CONSTRAINT "FK_66c32f3cb7664576dfb60b4a1e3"`);
        await queryRunner.query(`DROP INDEX "IDX_b124e0918ce6f002c194dd79b1"`);
        await queryRunner.query(`DROP INDEX "IDX_66c32f3cb7664576dfb60b4a1e"`);
        await queryRunner.query(`DROP TABLE "products_image_files"`);
    }

}
