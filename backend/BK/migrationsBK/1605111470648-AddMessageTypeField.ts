import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMessageTypeField1605111470648 implements MigrationInterface {
    name = 'AddMessageTypeField1605111470648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "message" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "messages_type_enum" AS ENUM('CONTACT', 'SUPPORT', 'INTERN')`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "type" "messages_type_enum" NOT NULL DEFAULT 'CONTACT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "messages_type_enum"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "message" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "email" DROP NOT NULL`);
    }

}
