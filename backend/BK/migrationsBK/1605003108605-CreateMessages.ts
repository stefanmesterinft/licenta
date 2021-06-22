import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessages1605003108605 implements MigrationInterface {
    name = 'CreateMessages1605003108605';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP, "name" character varying, 
            "email" character varying,
             "message" character varying, 
             "phone" character varying, 
             "location" character varying,
              "type" character varying, 
              CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "messages"');
    }
}
