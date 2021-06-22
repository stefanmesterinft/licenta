import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateColumns1603443052341 implements MigrationInterface {
    name = 'UpdateColumns1603443052341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "answers" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "parent_answers_required" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "parent_answers_required" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "answers" SET DEFAULT ''`);
    }

}
