/// <reference path="./types.ts" />
/// <reference path="./types.ts" />
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartEditorRef } from './chart-editor-ref';
import * as i0 from "@angular/core";
import * as i1 from "../../services/script-loader.service";
export class ChartEditorComponent {
    constructor(scriptLoaderService) {
        this.scriptLoaderService = scriptLoaderService;
        this.initializedSubject = new Subject();
    }
    /**
     * Emits as soon as the chart editor is fully initialized.
     */
    get initialized$() {
        return this.initializedSubject.asObservable();
    }
    ngOnInit() {
        this.scriptLoaderService.loadChartPackages('charteditor').subscribe(() => {
            this.editor = new google.visualization.ChartEditor();
            this.initializedSubject.next(this.editor);
            this.initializedSubject.complete();
        });
    }
    editChart(component, options) {
        if (!component.chartWrapper) {
            throw new Error('Chart wrapper is `undefined`. Please wait for the `initialized$` observable before trying to edit a chart.');
        }
        if (!this.editor) {
            throw new Error('Chart editor is `undefined`. Please wait for the `initialized$` observable before trying to edit a chart.');
        }
        const handle = new ChartEditorRef(this.editor);
        this.editor.openDialog(component.chartWrapper, options || {});
        handle.afterClosed().subscribe(result => {
            if (result) {
                component.chartWrapper = result;
            }
        });
        return handle;
    }
}
ChartEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChartEditorComponent, deps: [{ token: i1.ScriptLoaderService }], target: i0.ɵɵFactoryTarget.Component });
ChartEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: ChartEditorComponent, selector: "chart-editor", host: { classAttribute: "chart-editor" }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChartEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'chart-editor',
                    template: `<ng-content></ng-content>`,
                    host: { class: 'chart-editor' },
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i1.ScriptLoaderService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvYW5ndWxhci1nb29nbGUtY2hhcnRzL3NyYy9saWIvY29tcG9uZW50cy9jaGFydC1lZGl0b3IvY2hhcnQtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtQ0FBbUM7QUFBbkMsbUNBQW1DO0FBRW5DLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUczRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7OztBQVFwRCxNQUFNLE9BQU8sb0JBQW9CO0lBSS9CLFlBQW9CLG1CQUF3QztRQUF4Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBRnBELHVCQUFrQixHQUFHLElBQUksT0FBTyxFQUFvQyxDQUFDO0lBRWQsQ0FBQztJQUVoRTs7T0FFRztJQUNILElBQVcsWUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRU0sUUFBUTtRQUNiLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3ZFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFXTSxTQUFTLENBQUMsU0FBb0IsRUFBRSxPQUFpRDtRQUN0RixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRTtZQUMzQixNQUFNLElBQUksS0FBSyxDQUNiLDRHQUE0RyxDQUM3RyxDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixNQUFNLElBQUksS0FBSyxDQUNiLDJHQUEyRyxDQUM1RyxDQUFDO1NBQ0g7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7UUFFOUQsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN0QyxJQUFJLE1BQU0sRUFBRTtnQkFDVixTQUFTLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQzthQUNqQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7aUhBcERVLG9CQUFvQjtxR0FBcEIsb0JBQW9CLDhGQUpyQiwyQkFBMkI7MkZBSTFCLG9CQUFvQjtrQkFOaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRTtvQkFDL0IsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHlwZXMudHNcIiAvPlxyXG5cclxuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IFNjcmlwdExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zY3JpcHQtbG9hZGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDaGFydEJhc2UgfSBmcm9tICcuLi9jaGFydC1iYXNlL2NoYXJ0LWJhc2UuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IENoYXJ0RWRpdG9yUmVmIH0gZnJvbSAnLi9jaGFydC1lZGl0b3ItcmVmJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnY2hhcnQtZWRpdG9yJyxcclxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxyXG4gIGhvc3Q6IHsgY2xhc3M6ICdjaGFydC1lZGl0b3InIH0sXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIENoYXJ0RWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBwcml2YXRlIGVkaXRvcjogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRFZGl0b3IgfCB1bmRlZmluZWQ7XHJcbiAgcHJpdmF0ZSBpbml0aWFsaXplZFN1YmplY3QgPSBuZXcgU3ViamVjdDxnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydEVkaXRvcj4oKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzY3JpcHRMb2FkZXJTZXJ2aWNlOiBTY3JpcHRMb2FkZXJTZXJ2aWNlKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyBhcyBzb29uIGFzIHRoZSBjaGFydCBlZGl0b3IgaXMgZnVsbHkgaW5pdGlhbGl6ZWQuXHJcbiAgICovXHJcbiAgcHVibGljIGdldCBpbml0aWFsaXplZCQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplZFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnNjcmlwdExvYWRlclNlcnZpY2UubG9hZENoYXJ0UGFja2FnZXMoJ2NoYXJ0ZWRpdG9yJykuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5lZGl0b3IgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRFZGl0b3IoKTtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZFN1YmplY3QubmV4dCh0aGlzLmVkaXRvcik7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWRTdWJqZWN0LmNvbXBsZXRlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9wZW5zIHRoZSBjaGFydCBlZGl0b3IgYXMgYW4gZW1iZWRkZWQgZGlhbG9nIGJveCBvbiB0aGUgcGFnZS5cclxuICAgKiBJZiB0aGUgZWRpdG9yIGdldHMgc2F2ZWQsIHRoZSBjb21wb25lbnRzJyBjaGFydCB3aWxsIGJlIHVwZGF0ZWQgd2l0aCB0aGUgcmVzdWx0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbXBvbmVudCBUaGUgY2hhcnQgdG8gYmUgZWRpdGVkLlxyXG4gICAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIHRoZSBvcGVuIGVkaXRvci5cclxuICAgKi9cclxuICBwdWJsaWMgZWRpdENoYXJ0KGNvbXBvbmVudDogQ2hhcnRCYXNlKTogQ2hhcnRFZGl0b3JSZWY7XHJcbiAgcHVibGljIGVkaXRDaGFydChjb21wb25lbnQ6IENoYXJ0QmFzZSwgb3B0aW9uczogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRFZGl0b3JPcHRpb25zKTogQ2hhcnRFZGl0b3JSZWY7XHJcbiAgcHVibGljIGVkaXRDaGFydChjb21wb25lbnQ6IENoYXJ0QmFzZSwgb3B0aW9ucz86IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0RWRpdG9yT3B0aW9ucykge1xyXG4gICAgaWYgKCFjb21wb25lbnQuY2hhcnRXcmFwcGVyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAnQ2hhcnQgd3JhcHBlciBpcyBgdW5kZWZpbmVkYC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBgaW5pdGlhbGl6ZWQkYCBvYnNlcnZhYmxlIGJlZm9yZSB0cnlpbmcgdG8gZWRpdCBhIGNoYXJ0LidcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5lZGl0b3IpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICdDaGFydCBlZGl0b3IgaXMgYHVuZGVmaW5lZGAuIFBsZWFzZSB3YWl0IGZvciB0aGUgYGluaXRpYWxpemVkJGAgb2JzZXJ2YWJsZSBiZWZvcmUgdHJ5aW5nIHRvIGVkaXQgYSBjaGFydC4nXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaGFuZGxlID0gbmV3IENoYXJ0RWRpdG9yUmVmKHRoaXMuZWRpdG9yKTtcclxuICAgIHRoaXMuZWRpdG9yLm9wZW5EaWFsb2coY29tcG9uZW50LmNoYXJ0V3JhcHBlciwgb3B0aW9ucyB8fCB7fSk7XHJcblxyXG4gICAgaGFuZGxlLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICBjb21wb25lbnQuY2hhcnRXcmFwcGVyID0gcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gaGFuZGxlO1xyXG4gIH1cclxufVxyXG4iXX0=