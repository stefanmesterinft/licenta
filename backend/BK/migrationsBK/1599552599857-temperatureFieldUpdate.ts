import {MigrationInterface, QueryRunner} from "typeorm";

export class temperatureFieldUpdate1599552599857 implements MigrationInterface {
    name = 'temperatureFieldUpdate1599552599857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "temperature" TYPE numeric(4,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "temperature" TYPE numeric(2,2)`);
    }

}
