import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTimeFieldsToTest1603349410826 implements MigrationInterface {
    name = 'AddTimeFieldsToTest1603349410826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ADD "time_inserted" TIMESTAMP DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "tests" ADD "time_result" TIMESTAMP DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "time_result"`);
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "time_inserted"`);
    }

}
