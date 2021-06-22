import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTestFieldTYpeAndUpdateREsult1603356804272 implements MigrationInterface {
    name = 'AddTestFieldTYpeAndUpdateREsult1603356804272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ADD "type" character varying DEFAULT 'COVID19'`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_inserted" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_result" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_result" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_inserted" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "type"`);
    }

}
