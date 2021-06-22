import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCustomerFields1600700994860 implements MigrationInterface {
    name = 'UpdateCustomerFields1600700994860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Point,4326)`);
    }

}
