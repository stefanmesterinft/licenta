import {MigrationInterface, QueryRunner} from "typeorm";

export class addPhoneVerificationTable1607957893546 implements MigrationInterface {
    name = 'addPhoneVerificationTable1607957893546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "phone_verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "phone" character varying, "token" character varying, CONSTRAINT "PK_028d02e37d668b794d82247591b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "phone_verification"`);
    }

}
