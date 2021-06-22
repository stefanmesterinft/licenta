import {MigrationInterface, QueryRunner} from "typeorm";

export class SetSettingsOptionsFieldAsOptional1608292833607 implements MigrationInterface {
    name = 'SetSettingsOptionsFieldAsOptional1608292833607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "options" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "options" SET NOT NULL`);
    }

}
