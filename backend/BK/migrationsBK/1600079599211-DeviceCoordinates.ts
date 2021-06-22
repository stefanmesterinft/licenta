import {MigrationInterface, QueryRunner} from "typeorm";

export class DeviceCoordinates1600079599211 implements MigrationInterface {
    name = 'DeviceCoordinates1600079599211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ADD "location" geometry(Point,4326)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "location"`);
    }

}
