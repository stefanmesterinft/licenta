import {MigrationInterface, QueryRunner} from "typeorm";

export class TestDevices1600088711911 implements MigrationInterface {
    name = 'TestDevices1600088711911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tests_devices_devices" ("tests_id" uuid NOT NULL, "devices_id" uuid NOT NULL, CONSTRAINT "PK_ec4d6fe82c163cf45082bf7dfd4" PRIMARY KEY ("tests_id", "devices_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cce50cd62d940d1085cdbf55e5" ON "tests_devices_devices" ("tests_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1d24152d6e5df78e026d56e1fa" ON "tests_devices_devices" ("devices_id") `);
        await queryRunner.query(`ALTER TABLE "tests_devices_devices" ADD CONSTRAINT "FK_cce50cd62d940d1085cdbf55e56" FOREIGN KEY ("tests_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests_devices_devices" ADD CONSTRAINT "FK_1d24152d6e5df78e026d56e1fa9" FOREIGN KEY ("devices_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests_devices_devices" DROP CONSTRAINT "FK_1d24152d6e5df78e026d56e1fa9"`);
        await queryRunner.query(`ALTER TABLE "tests_devices_devices" DROP CONSTRAINT "FK_cce50cd62d940d1085cdbf55e56"`);
        await queryRunner.query(`DROP INDEX "IDX_1d24152d6e5df78e026d56e1fa"`);
        await queryRunner.query(`DROP INDEX "IDX_cce50cd62d940d1085cdbf55e5"`);
        await queryRunner.query(`DROP TABLE "tests_devices_devices"`);
    }

}
