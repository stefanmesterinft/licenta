import {MigrationInterface, QueryRunner} from "typeorm";

export class TetsChangeLocation1600413021631 implements MigrationInterface {
    name = 'TetsChangeLocation1600413021631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "tests" ADD "location" geography(Point)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "tests" ADD "location" geometry(POINT,4326)`);
    }

}
