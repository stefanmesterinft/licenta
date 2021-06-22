import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateQuestions1603297307593 implements MigrationInterface {
    name = 'UpdateQuestions1603297307593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "answers" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "answers" SET DEFAULT '[]'`);
    }

}
