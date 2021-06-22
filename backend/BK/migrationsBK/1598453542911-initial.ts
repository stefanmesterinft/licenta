import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1598453542911 implements MigrationInterface {
    name = 'initial1598453542911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "assigned_user"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "owner"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "renter"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "assigned_id" uuid`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "owner_id" uuid`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "renter_id" uuid`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_2b944cf16e55459837723435f67" FOREIGN KEY ("assigned_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_cce90811a9e65e2c51357a0fbbd" FOREIGN KEY ("owner_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_ba59333474e659aca5399f2c06b" FOREIGN KEY ("renter_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_ba59333474e659aca5399f2c06b"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_cce90811a9e65e2c51357a0fbbd"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_2b944cf16e55459837723435f67"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "renter_id"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "assigned_id"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "renter" character varying`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "owner" character varying`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "assigned_user" character varying`);
    }

}
