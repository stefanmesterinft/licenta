import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDeleteDateColumn1600417483650 implements MigrationInterface {
    name = 'AddDeleteDateColumn1600417483650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "samples" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tests" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Point)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Point)`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "deleted_at"`);
    }

}
