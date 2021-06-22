import {MigrationInterface, QueryRunner} from "typeorm";

export class addAdmin1598443290210 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "users"("first_name", "last_name", "roles", "email", "password")
        VALUES('Admin', 'Admin', '{ADMIN}', 'admin@admin.com', '$2b$10$9mn/9mdmAota2XfuwPLNSOlIRP33oyLMop1WSDca/pTGYBmT4utfm')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
