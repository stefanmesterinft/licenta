import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTemperatureField1599556913271 implements MigrationInterface {
    name = 'updateTemperatureField1599556913271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "temperature" TYPE numeric(5,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "temperature" TYPE numeric(4,2)`);
    }

}
