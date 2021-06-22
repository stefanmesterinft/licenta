import {MigrationInterface, QueryRunner} from "typeorm";

export class addAdmin1619168764465 implements MigrationInterface {
    name = 'addAdmin1619168764465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "users"("first_name", "last_name", "roles", "email", "password", "email_confirmed", "phone_confirmed")
        VALUES('Admin', 'Admin', '{ADMIN}', 'admin@admin.com', '$2b$10$9mn/9mdmAota2XfuwPLNSOlIRP33oyLMop1WSDca/pTGYBmT4utfm', true, true)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
