import {MigrationInterface, QueryRunner} from "typeorm";

export class FixQuestionTree1603459662489 implements MigrationInterface {
    name = 'FixQuestionTree1603459662489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "nsleft" integer NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "nsright" integer NOT NULL DEFAULT 2`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "nsright"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "nsleft"`);
    }

}
