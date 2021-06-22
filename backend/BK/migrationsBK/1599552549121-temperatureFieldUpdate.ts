import {MigrationInterface, QueryRunner} from "typeorm";

export class temperatureFieldUpdate1599552549121 implements MigrationInterface {
    name = 'temperatureFieldUpdate1599552549121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "date_of_birth" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "temperature"`);
        await queryRunner.query(`ALTER TABLE "tests" ADD "temperature" numeric(2,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "temperature"`);
        await queryRunner.query(`ALTER TABLE "tests" ADD "temperature" integer`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "date_of_birth" character varying`);
    }

}
