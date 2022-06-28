import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { generateRandomId } from '../../helpers/id.helper';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { FilterType } from '../../types/control-type';
import * as i0 from "@angular/core";
import * as i1 from "../../services/script-loader.service";
export class ControlWrapperComponent {
    constructor(loaderService) {
        this.loaderService = loaderService;
        /**
         * Emits when an error occurs when attempting to render the control.
         */
        this.error = new EventEmitter();
        /**
         * The control is ready to accept user interaction and for external method calls.
         *
         * Alternatively, you can listen for a ready event on the dashboard holding the control
         * and call control methods only after the event was fired.
         */
        this.ready = new EventEmitter();
        /**
         * Emits when the user interacts with the control, affecting its state.
         * For example, a `stateChange` event will be emitted whenever you move the thumbs of a range slider control.
         *
         * To retrieve an updated control state after the event fired, call `ControlWrapper.getState()`.
         */
        this.stateChange = new EventEmitter();
        /**
         * A generated id assigned to this components DOM element.
         */
        this.id = generateRandomId();
        this.wrapperReadySubject = new ReplaySubject(1);
    }
    /**
     * Emits after the `ControlWrapper` was created.
     */
    get wrapperReady$() {
        return this.wrapperReadySubject.asObservable();
    }
    get controlWrapper() {
        if (!this._controlWrapper) {
            throw new Error(`Cannot access the control wrapper before it being initialized.`);
        }
        return this._controlWrapper;
    }
    ngOnInit() {
        this.loaderService.loadChartPackages('controls').subscribe(() => {
            this.createControlWrapper();
        });
    }
    ngOnChanges(changes) {
        if (!this._controlWrapper) {
            return;
        }
        if (changes.type) {
            this._controlWrapper.setControlType(this.type);
        }
        if (changes.options) {
            this._controlWrapper.setOptions(this.options || {});
        }
        if (changes.state) {
            this._controlWrapper.setState(this.state || {});
        }
    }
    createControlWrapper() {
        this._controlWrapper = new google.visualization.ControlWrapper({
            containerId: this.id,
            controlType: this.type,
            state: this.state,
            options: this.options
        });
        this.addEventListeners();
        this.wrapperReadySubject.next(this._controlWrapper);
    }
    addEventListeners() {
        google.visualization.events.removeAllListeners(this._controlWrapper);
        google.visualization.events.addListener(this._controlWrapper, 'ready', (event) => this.ready.emit(event));
        google.visualization.events.addListener(this._controlWrapper, 'error', (event) => this.error.emit(event));
        google.visualization.events.addListener(this._controlWrapper, 'statechange', (event) => this.stateChange.emit(event));
    }
}
ControlWrapperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ControlWrapperComponent, deps: [{ token: i1.ScriptLoaderService }], target: i0.ɵɵFactoryTarget.Component });
ControlWrapperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: ControlWrapperComponent, selector: "control-wrapper", inputs: { for: "for", type: "type", options: "options", state: "state" }, outputs: { error: "error", ready: "ready", stateChange: "stateChange" }, host: { properties: { "id": "this.id" }, classAttribute: "control-wrapper" }, exportAs: ["controlWrapper"], usesOnChanges: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ControlWrapperComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'control-wrapper',
                    template: '',
                    host: { class: 'control-wrapper' },
                    exportAs: 'controlWrapper',
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i1.ScriptLoaderService }]; }, propDecorators: { for: [{
                type: Input
            }], type: [{
                type: Input
            }], options: [{
                type: Input
            }], state: [{
                type: Input
            }], error: [{
                type: Output
            }], ready: [{
                type: Output
            }], stateChange: [{
                type: Output
            }], id: [{
                type: HostBinding,
                args: ['id']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC13cmFwcGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvYW5ndWxhci1nb29nbGUtY2hhcnRzL3NyYy9saWIvY29tcG9uZW50cy9jb250cm9sLXdyYXBwZXIvY29udHJvbC13cmFwcGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osV0FBVyxFQUNYLEtBQUssRUFHTCxNQUFNLEVBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVyQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7OztBQVd0RCxNQUFNLE9BQU8sdUJBQXVCO0lBbUZsQyxZQUFvQixhQUFrQztRQUFsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBcUI7UUFqQ3REOztXQUVHO1FBRUksVUFBSyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRW5EOzs7OztXQUtHO1FBRUksVUFBSyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRW5EOzs7OztXQUtHO1FBRUksZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBRWpEOztXQUVHO1FBRWEsT0FBRSxHQUFHLGdCQUFnQixFQUFFLENBQUM7UUFHaEMsd0JBQW1CLEdBQUcsSUFBSSxhQUFhLENBQXNDLENBQUMsQ0FBQyxDQUFDO0lBRS9CLENBQUM7SUFFMUQ7O09BRUc7SUFDSCxJQUFXLGFBQWE7UUFDdEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELElB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SUFBSTtzQkFEVixLQUFLO2dCQWNDLE9BQU87c0JBRGIsS0FBSztnQkFrQkMsS0FBSztzQkFEWCxLQUFLO2dCQU9DLEtBQUs7c0JBRFgsTUFBTTtnQkFVQSxLQUFLO3NCQURYLE1BQU07Z0JBVUEsV0FBVztzQkFEakIsTUFBTTtnQkFPUyxFQUFFO3NCQURqQixXQUFXO3VCQUFDLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbXBvbmVudCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdEJpbmRpbmcsXHJcbiAgSW5wdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uSW5pdCxcclxuICBPdXRwdXQsXHJcbiAgU2ltcGxlQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbUlkIH0gZnJvbSAnLi4vLi4vaGVscGVycy9pZC5oZWxwZXInO1xyXG5pbXBvcnQgeyBTY3JpcHRMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRmlsdGVyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL2NvbnRyb2wtdHlwZSc7XHJcbmltcG9ydCB7IENoYXJ0RXJyb3JFdmVudCwgQ2hhcnRSZWFkeUV2ZW50IH0gZnJvbSAnLi4vLi4vdHlwZXMvZXZlbnRzJztcclxuaW1wb3J0IHsgQ2hhcnRCYXNlIH0gZnJvbSAnLi4vY2hhcnQtYmFzZS9jaGFydC1iYXNlLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NvbnRyb2wtd3JhcHBlcicsXHJcbiAgdGVtcGxhdGU6ICcnLFxyXG4gIGhvc3Q6IHsgY2xhc3M6ICdjb250cm9sLXdyYXBwZXInIH0sXHJcbiAgZXhwb3J0QXM6ICdjb250cm9sV3JhcHBlcicsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIENvbnRyb2xXcmFwcGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIC8qKlxyXG4gICAqIENoYXJ0cyBjb250cm9sbGVkIGJ5IHRoaXMgY29udHJvbCB3cmFwcGVyLiBDYW4gYmUgYSBzaW5nbGUgY2hhcnQgb3IgYW4gYXJyYXkgb2YgY2hhcnRzLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIGZvciE6IENoYXJ0QmFzZSB8IENoYXJ0QmFzZVtdO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgY29udHJvbC5cclxuICAgKiBUaGUgYGdvb2dsZS52aXN1YWxpemF0aW9uYCBwYWNrYWdlIG5hbWUgY2FuIGJlIG9taXR0ZWQgZm9yIEdvb2dsZSBjb250cm9scy5cclxuICAgKlxyXG4gICAqIEBleGFtcGxlXHJcbiAgICpcclxuICAgKiBgYGBodG1sXHJcbiAgICogPGNvbnRyb2wtd3JhcHBlciB0eXBlPVwiQ2F0ZWdvcnlGaWx0ZXJcIj48L2NvbnRyb2wtd3JhcHBlcj5cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHB1YmxpYyB0eXBlITogRmlsdGVyVHlwZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIG9wdGlvbnMgZm9yIHRoZSBjb250cm9sLlxyXG4gICAqIFlvdSBjYW4gdXNlIGVpdGhlciBKYXZhU2NyaXB0IGxpdGVyYWwgbm90YXRpb24sIG9yIHByb3ZpZGUgYSBoYW5kbGUgdG8gdGhlIG9iamVjdC5cclxuICAgKlxyXG4gICAqIEBleGFtcGxlXHJcbiAgICpcclxuICAgKiBgYGBodG1sXHJcbiAgICogPGNvbnRyb2wtd3JhcHBlciBbb3B0aW9uc109XCJ7J2ZpbHRlckNvbHVtbkxhYmVsJzogJ0FnZScsICdtaW5WYWx1ZSc6IDEwLCAnbWF4VmFsdWUnOiA4MH1cIj48L2NvbnRyb2wtd3JhcHBlcj5cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHB1YmxpYyBvcHRpb25zPzogb2JqZWN0O1xyXG5cclxuICAvKipcclxuICAgKiBBbiBvYmplY3QgZGVzY3JpYmluZyB0aGUgc3RhdGUgb2YgdGhlIGNvbnRyb2wuXHJcbiAgICogVGhlIHN0YXRlIGNvbGxlY3RzIGFsbCB0aGUgdmFyaWFibGVzIHRoYXQgdGhlIHVzZXIgb3BlcmF0aW5nIHRoZSBjb250cm9sIGNhbiBhZmZlY3QuXHJcbiAgICpcclxuICAgKiBGb3IgZXhhbXBsZSwgYSByYW5nZSBzbGlkZXIgc3RhdGUgY2FuIGJlIGRlc2NyaWJlZCBpbiB0ZXJtIG9mIHRoZSBwb3NpdGlvbnMgdGhhdCB0aGUgbG93IGFuZCBoaWdoIHRodW1iXHJcbiAgICogb2YgdGhlIHNsaWRlciBvY2N1cHkuXHJcbiAgICogWW91IGNhbiB1c2UgZWl0aGVyIEphdmFzY3JpcHQgbGl0ZXJhbCBub3RhdGlvbiwgb3IgcHJvdmlkZSBhIGhhbmRsZSB0byB0aGUgb2JqZWN0LlxyXG4gICAqXHJcbiAgICogQGV4YW1wbGVcclxuICAgKlxyXG4gICAqICBgYGBodG1sXHJcbiAgICogPGNvbnRyb2wtd3JhcHBlciBbc3RhdGVdPVwieydsb3dWYWx1ZSc6IDIwLCAnaGlnaFZhbHVlJzogNTB9XCI+PC9jb250cm9sLXdyYXBwZXI+XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBwdWJsaWMgc3RhdGU/OiBvYmplY3Q7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXRzIHdoZW4gYW4gZXJyb3Igb2NjdXJzIHdoZW4gYXR0ZW1wdGluZyB0byByZW5kZXIgdGhlIGNvbnRyb2wuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEVycm9yRXZlbnQ+KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBjb250cm9sIGlzIHJlYWR5IHRvIGFjY2VwdCB1c2VyIGludGVyYWN0aW9uIGFuZCBmb3IgZXh0ZXJuYWwgbWV0aG9kIGNhbGxzLlxyXG4gICAqXHJcbiAgICogQWx0ZXJuYXRpdmVseSwgeW91IGNhbiBsaXN0ZW4gZm9yIGEgcmVhZHkgZXZlbnQgb24gdGhlIGRhc2hib2FyZCBob2xkaW5nIHRoZSBjb250cm9sXHJcbiAgICogYW5kIGNhbGwgY29udHJvbCBtZXRob2RzIG9ubHkgYWZ0ZXIgdGhlIGV2ZW50IHdhcyBmaXJlZC5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgcmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0UmVhZHlFdmVudD4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHMgd2hlbiB0aGUgdXNlciBpbnRlcmFjdHMgd2l0aCB0aGUgY29udHJvbCwgYWZmZWN0aW5nIGl0cyBzdGF0ZS5cclxuICAgKiBGb3IgZXhhbXBsZSwgYSBgc3RhdGVDaGFuZ2VgIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aGVuZXZlciB5b3UgbW92ZSB0aGUgdGh1bWJzIG9mIGEgcmFuZ2Ugc2xpZGVyIGNvbnRyb2wuXHJcbiAgICpcclxuICAgKiBUbyByZXRyaWV2ZSBhbiB1cGRhdGVkIGNvbnRyb2wgc3RhdGUgYWZ0ZXIgdGhlIGV2ZW50IGZpcmVkLCBjYWxsIGBDb250cm9sV3JhcHBlci5nZXRTdGF0ZSgpYC5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgc3RhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHVua25vd24+KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgZ2VuZXJhdGVkIGlkIGFzc2lnbmVkIHRvIHRoaXMgY29tcG9uZW50cyBET00gZWxlbWVudC5cclxuICAgKi9cclxuICBASG9zdEJpbmRpbmcoJ2lkJylcclxuICBwdWJsaWMgcmVhZG9ubHkgaWQgPSBnZW5lcmF0ZVJhbmRvbUlkKCk7XHJcblxyXG4gIHByaXZhdGUgX2NvbnRyb2xXcmFwcGVyPzogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ29udHJvbFdyYXBwZXI7XHJcbiAgcHJpdmF0ZSB3cmFwcGVyUmVhZHlTdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8Z29vZ2xlLnZpc3VhbGl6YXRpb24uQ29udHJvbFdyYXBwZXI+KDEpO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvYWRlclNlcnZpY2U6IFNjcmlwdExvYWRlclNlcnZpY2UpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXRzIGFmdGVyIHRoZSBgQ29udHJvbFdyYXBwZXJgIHdhcyBjcmVhdGVkLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXQgd3JhcHBlclJlYWR5JCgpIHtcclxuICAgIHJldHVybiB0aGlzLndyYXBwZXJSZWFkeVN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IGNvbnRyb2xXcmFwcGVyKCk6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNvbnRyb2xXcmFwcGVyIHtcclxuICAgIGlmICghdGhpcy5fY29udHJvbFdyYXBwZXIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgYWNjZXNzIHRoZSBjb250cm9sIHdyYXBwZXIgYmVmb3JlIGl0IGJlaW5nIGluaXRpYWxpemVkLmApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9jb250cm9sV3JhcHBlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5sb2FkQ2hhcnRQYWNrYWdlcygnY29udHJvbHMnKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmNyZWF0ZUNvbnRyb2xXcmFwcGVyKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuX2NvbnRyb2xXcmFwcGVyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy50eXBlKSB7XHJcbiAgICAgIHRoaXMuX2NvbnRyb2xXcmFwcGVyLnNldENvbnRyb2xUeXBlKHRoaXMudHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXMub3B0aW9ucykge1xyXG4gICAgICB0aGlzLl9jb250cm9sV3JhcHBlci5zZXRPcHRpb25zKHRoaXMub3B0aW9ucyB8fCB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXMuc3RhdGUpIHtcclxuICAgICAgdGhpcy5fY29udHJvbFdyYXBwZXIuc2V0U3RhdGUodGhpcy5zdGF0ZSB8fCB7fSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUNvbnRyb2xXcmFwcGVyKCkge1xyXG4gICAgdGhpcy5fY29udHJvbFdyYXBwZXIgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ29udHJvbFdyYXBwZXIoe1xyXG4gICAgICBjb250YWluZXJJZDogdGhpcy5pZCxcclxuICAgICAgY29udHJvbFR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXHJcbiAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9uc1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVycygpO1xyXG4gICAgdGhpcy53cmFwcGVyUmVhZHlTdWJqZWN0Lm5leHQodGhpcy5fY29udHJvbFdyYXBwZXIpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRFdmVudExpc3RlbmVycygpIHtcclxuICAgIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5yZW1vdmVBbGxMaXN0ZW5lcnModGhpcy5fY29udHJvbFdyYXBwZXIpO1xyXG5cclxuICAgIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5hZGRMaXN0ZW5lcih0aGlzLl9jb250cm9sV3JhcHBlciwgJ3JlYWR5JywgKGV2ZW50OiBDaGFydFJlYWR5RXZlbnQpID0+XHJcbiAgICAgIHRoaXMucmVhZHkuZW1pdChldmVudClcclxuICAgICk7XHJcbiAgICBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHMuYWRkTGlzdGVuZXIodGhpcy5fY29udHJvbFdyYXBwZXIsICdlcnJvcicsIChldmVudDogQ2hhcnRFcnJvckV2ZW50KSA9PlxyXG4gICAgICB0aGlzLmVycm9yLmVtaXQoZXZlbnQpXHJcbiAgICApO1xyXG4gICAgZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzLmFkZExpc3RlbmVyKHRoaXMuX2NvbnRyb2xXcmFwcGVyLCAnc3RhdGVjaGFuZ2UnLCAoZXZlbnQ6IHVua25vd24pID0+XHJcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2UuZW1pdChldmVudClcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdfQ==