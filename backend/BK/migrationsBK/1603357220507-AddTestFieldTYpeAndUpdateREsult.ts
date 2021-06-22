import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTestFieldTYpeAndUpdateREsult1603357220507 implements MigrationInterface {
    name = 'AddTestFieldTYpeAndUpdateREsult1603357220507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ADD "reason" character varying`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_inserted" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_result" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_result" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_inserted" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "reason"`);
    }

}
