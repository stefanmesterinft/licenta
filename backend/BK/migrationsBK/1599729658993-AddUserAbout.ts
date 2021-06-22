import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserAbout1599729658993 implements MigrationInterface {
    name = 'AddUserAbout1599729658993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "about" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "about"`);
    }

}
