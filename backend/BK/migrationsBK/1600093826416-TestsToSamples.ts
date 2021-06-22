import {MigrationInterface, QueryRunner} from "typeorm";

export class TestsToSamples1600093826416 implements MigrationInterface {
    name = 'TestsToSamples1600093826416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ADD "sample_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tests" ADD CONSTRAINT "FK_e37c409a71e98354dfa80dca9b8" FOREIGN KEY ("sample_id") REFERENCES "samples"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" DROP CONSTRAINT "FK_e37c409a71e98354dfa80dca9b8"`);
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "sample_id"`);
    }

}
