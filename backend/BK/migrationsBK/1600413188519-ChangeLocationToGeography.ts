import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeLocationToGeography1600413188519 implements MigrationInterface {
    name = 'ChangeLocationToGeography1600413188519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "location" geography(Point)`);
        await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "samples" ADD "location" geography(Point)`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "samples" ADD "location" geometry(POINT,4326)`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "location" geometry(POINT,4326)`);
    }

}
