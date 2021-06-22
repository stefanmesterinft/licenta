import {MigrationInterface, QueryRunner} from "typeorm";

export class FixGeographyMigrations1600701324958 implements MigrationInterface {
    name = 'FixGeographyMigrations1600701324958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point,4326)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Geometry,0)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Geometry,0)`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Geometry,0)`);
    }

}
