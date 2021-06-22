import {MigrationInterface, QueryRunner} from "typeorm";

export class FixGeographyMigrations1600701085638 implements MigrationInterface {
    name = 'FixGeographyMigrations1600701085638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Geometry,0)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Geometry,0)`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Geometry,0)`);
    }

}
