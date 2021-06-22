import {MigrationInterface, QueryRunner} from "typeorm";

export class FixSamples1600444308658 implements MigrationInterface {
    name = 'FixSamples1600444308658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Point)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Point)`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Point,4326)`);
    }

}
