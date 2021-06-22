import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAnswersToTests1603726694748 implements MigrationInterface {
    name = 'AddAnswersToTests1603726694748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ADD "questions" json DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "questions"`);
    }

}
