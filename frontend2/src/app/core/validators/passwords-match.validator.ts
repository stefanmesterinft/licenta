import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function PasswordsMatch(frm: FormGroup) {
    return frm.get('password').value === frm.get('confirmPassword').value
       ? null : {'passwordsMismatch': true};
}