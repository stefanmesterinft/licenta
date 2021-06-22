import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNewColumns1603442271982 implements MigrationInterface {
    name = 'AddNewColumns1603442271982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "parent_answers_required" text DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_inserted" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_result" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "answers" SET DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "answers" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_result" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "time_inserted" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "parent_answers_required"`);
    }

}
