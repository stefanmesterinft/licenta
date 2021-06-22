import {MigrationInterface, QueryRunner} from "typeorm";

export class FixEmailAddress1607683252407 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "users" SET email=lower(email)`);
        await queryRunner.query(`UPDATE "customers" SET email=lower(email)`);
        await queryRunner.query(`UPDATE "messages" SET email=lower(email)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
