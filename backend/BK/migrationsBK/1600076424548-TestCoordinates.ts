import {MigrationInterface, QueryRunner} from "typeorm";

export class TestCoordinates1600076424548 implements MigrationInterface {
    name = 'TestCoordinates1600076424548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);
        await queryRunner.query(`ALTER TABLE "tests" ADD "location" geometry(Point,4326)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP EXTENSION IF EXISTS postgis;`);
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "location"`);
    }

}
