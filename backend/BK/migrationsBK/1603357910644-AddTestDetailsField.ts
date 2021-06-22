import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTestDetailsField1603357910644 implements MigrationInterface {
    name = 'AddTestDetailsField1603357910644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ADD "details" json DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_inserted" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_result" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_result" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_inserted" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "details"`);
    }

}
