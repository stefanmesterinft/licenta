import {MigrationInterface, QueryRunner} from "typeorm";

export class FileTableAndProducts31622061324986 implements MigrationInterface {
    name = 'FileTableAndProducts31622061324986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_691a4cf972284fceae2424e987f" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_691a4cf972284fceae2424e987f"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "image_id"`);
    }

}
