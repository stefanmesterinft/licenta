import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function TesterRoleValidator(frm: FormGroup) {
    return !frm.get('tester').value && !frm.get('monitor').value
       ? {'atLeastOneRole': true} : null
}