import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserPhoneConfirmAndIndex1608111717200 implements MigrationInterface {
    name = 'addUserPhoneConfirmAndIndex1608111717200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_confirmed" boolean DEFAULT false`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_912ea7e67e2c7ef4398f08be5f" ON "users" ("phone") WHERE deleted_at is NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_912ea7e67e2c7ef4398f08be5f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_confirmed"`);
    }

}
