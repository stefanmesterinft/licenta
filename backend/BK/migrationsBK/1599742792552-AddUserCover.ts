import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserCover1599742792552 implements MigrationInterface {
    name = 'AddUserCover1599742792552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "cover" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cover"`);
    }

}
