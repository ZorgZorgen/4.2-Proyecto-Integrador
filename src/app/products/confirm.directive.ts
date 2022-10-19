import { Directive, Input, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[confirm]'
})
export class ConfirmDirective {
    @Output() confirm = new EventEmitter<any>(); // se puede reutilizar el selector name para un output!
    @Input() confirmMessage: string = 'Estas seguro ?';

    @HostListener('click')
    onClick() {
        const confirmed = window.confirm(this.confirmMessage);

        if(confirmed && this.confirm) {
            this.confirm.emit()
        }
    }
}