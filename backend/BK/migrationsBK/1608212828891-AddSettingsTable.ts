import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSettingsTable1608212828891 implements MigrationInterface {
    name = 'AddSettingsTable1608212828891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "value" character varying NOT NULL, "description" character varying, "name" character varying NOT NULL, "options" text NOT NULL, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "settings" ("name","description","value","options") VALUES ('SMS Provider','The SMS service that will be used to send account confirmation texts','i2SMS', 'i2SMS,Twilio')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
