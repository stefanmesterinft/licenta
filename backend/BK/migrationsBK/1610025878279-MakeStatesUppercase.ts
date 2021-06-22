import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeStatesUppercase1610025878279 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "users" SET state=upper(state)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
