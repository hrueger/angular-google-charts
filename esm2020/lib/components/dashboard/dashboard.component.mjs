import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { combineLatest } from 'rxjs';
import { DataTableService } from '../../services/data-table.service';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { ControlWrapperComponent } from '../control-wrapper/control-wrapper.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/script-loader.service";
import * as i2 from "../../services/data-table.service";
export class DashboardComponent {
    constructor(element, loaderService, dataTableService) {
        this.element = element;
        this.loaderService = loaderService;
        this.dataTableService = dataTableService;
        /**
         * The dashboard has completed drawing and is ready to accept changes.
         *
         * The ready event will also fire:
         * - after the completion of a dashboard refresh triggered by a user or programmatic interaction with one of the controls,
         * - after redrawing any chart on the dashboard.
         */
        this.ready = new EventEmitter();
        /**
         * Emits when an error occurs when attempting to render the dashboard.
         * One or more of the controls and charts that are part of the dashboard may have failed rendering.
         */
        this.error = new EventEmitter();
        this.initialized = false;
    }
    ngOnInit() {
        this.loaderService.loadChartPackages('controls').subscribe(() => {
            this.dataTable = this.dataTableService.create(this.data, this.columns, this.formatters);
            this.createDashboard();
            this.initialized = true;
        });
    }
    ngOnChanges(changes) {
        if (!this.initialized) {
            return;
        }
        if (changes.data || changes.columns || changes.formatters) {
            this.dataTable = this.dataTableService.create(this.data, this.columns, this.formatters);
            this.dashboard.draw(this.dataTable);
        }
    }
    createDashboard() {
        // TODO: This should happen in the control wrapper
        // However, I don't yet know how to do this because then `bind()` would get called multiple times
        // for the same control if something changes. This is not supported by google charts as far as I can tell
        // from their source code.
        const controlWrappersReady$ = this.controlWrappers.map(control => control.wrapperReady$);
        const chartsReady$ = this.controlWrappers
            .map(control => control.for)
            .map(charts => {
            if (Array.isArray(charts)) {
                // CombineLatest waits for all observables
                return combineLatest(charts.map(chart => chart.wrapperReady$));
            }
            else {
                return charts.wrapperReady$;
            }
        });
        // We have to wait for all chart wrappers and control wrappers to be initialized
        // before we can compose them together to create the dashboard
        combineLatest([...controlWrappersReady$, ...chartsReady$]).subscribe(() => {
            this.dashboard = new google.visualization.Dashboard(this.element.nativeElement);
            this.initializeBindings();
            this.registerEvents();
            this.dashboard.draw(this.dataTable);
        });
    }
    registerEvents() {
        google.visualization.events.removeAllListeners(this.dashboard);
        const registerDashEvent = (object, eventName, callback) => {
            google.visualization.events.addListener(object, eventName, callback);
        };
        registerDashEvent(this.dashboard, 'ready', () => this.ready.emit());
        registerDashEvent(this.dashboard, 'error', (error) => this.error.emit(error));
    }
    initializeBindings() {
        this.controlWrappers.forEach(control => {
            if (Array.isArray(control.for)) {
                const chartWrappers = control.for.map(chart => chart.chartWrapper);
                this.dashboard.bind(control.controlWrapper, chartWrappers);
            }
            else {
                this.dashboard.bind(control.controlWrapper, control.for.chartWrapper);
            }
        });
    }
}
DashboardComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: DashboardComponent, deps: [{ token: i0.ElementRef }, { token: i1.ScriptLoaderService }, { token: i2.DataTableService }], target: i0.ɵɵFactoryTarget.Component });
DashboardComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: DashboardComponent, selector: "dashboard", inputs: { data: "data", columns: "columns", formatters: "formatters" }, outputs: { ready: "ready", error: "error" }, host: { classAttribute: "dashboard" }, queries: [{ propertyName: "controlWrappers", predicate: ControlWrapperComponent }], exportAs: ["dashboard"], usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: DashboardComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'dashboard',
                    template: '<ng-content></ng-content>',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    exportAs: 'dashboard',
                    host: { class: 'dashboard' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ScriptLoaderService }, { type: i2.DataTableService }]; }, propDecorators: { data: [{
                type: Input
            }], columns: [{
                type: Input
            }], formatters: [{
                type: Input
            }], ready: [{
                type: Output
            }], error: [{
                type: Output
            }], controlWrappers: [{
                type: ContentChildren,
                args: [ControlWrapperComponent]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvYW5ndWxhci1nb29nbGUtY2hhcnRzL3NyYy9saWIvY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLFNBQVMsRUFFVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXJDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBSTNFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7O0FBU3ZGLE1BQU0sT0FBTyxrQkFBa0I7SUFtRDdCLFlBQ1UsT0FBbUIsRUFDbkIsYUFBa0MsRUFDbEMsZ0JBQWtDO1FBRmxDLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFDbkIsa0JBQWEsR0FBYixhQUFhLENBQXFCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUEzQjVDOzs7Ozs7V0FNRztRQUVJLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBRXhDOzs7V0FHRztRQUVJLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQU8zQyxnQkFBVyxHQUFHLEtBQUssQ0FBQztJQU16QixDQUFDO0lBRUcsUUFBUTtRQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUM5RCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFB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OlsiaW1wb3J0IHtcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgQ29udGVudENoaWxkcmVuLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIElucHV0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFF1ZXJ5TGlzdCxcclxuICBTaW1wbGVDaGFuZ2VzXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IERhdGFUYWJsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kYXRhLXRhYmxlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTY3JpcHRMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hhcnRFcnJvckV2ZW50IH0gZnJvbSAnLi4vLi4vdHlwZXMvZXZlbnRzJztcclxuaW1wb3J0IHsgRm9ybWF0dGVyIH0gZnJvbSAnLi4vLi4vdHlwZXMvZm9ybWF0dGVyJztcclxuaW1wb3J0IHsgQ29sdW1uLCBSb3cgfSBmcm9tICcuLi9jaGFydC1iYXNlL2NoYXJ0LWJhc2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29udHJvbFdyYXBwZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb250cm9sLXdyYXBwZXIvY29udHJvbC13cmFwcGVyLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2Rhc2hib2FyZCcsXHJcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBleHBvcnRBczogJ2Rhc2hib2FyZCcsXHJcbiAgaG9zdDogeyBjbGFzczogJ2Rhc2hib2FyZCcgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIC8qKlxyXG4gICAqIERhdGEgdXNlZCB0byBpbml0aWFsaXplIHRoZSB0YWJsZS5cclxuICAgKlxyXG4gICAqIFRoaXMgbXVzdCBhbHNvIGNvbnRhaW4gYWxsIHJvbGVzIHRoYXQgYXJlIHNldCBpbiB0aGUgYGNvbHVtbnNgIHByb3BlcnR5LlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIGRhdGEhOiBSb3dbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGNvbHVtbnMgdGhlIGBkYXRhYCBjb25zaXN0cyBvZi5cclxuICAgKiBUaGUgbGVuZ3RoIG9mIHRoaXMgYXJyYXkgbXVzdCBtYXRjaCB0aGUgbGVuZ3RoIG9mIGVhY2ggcm93IGluIHRoZSBgZGF0YWAgb2JqZWN0LlxyXG4gICAqXHJcbiAgICogSWYge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2NoYXJ0L2ludGVyYWN0aXZlL2RvY3Mvcm9sZXMgcm9sZXN9IHNob3VsZCBiZSBhcHBsaWVkLCB0aGV5IG11c3QgYmUgaW5jbHVkZWQgaW4gdGhpcyBhcnJheSBhcyB3ZWxsLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIGNvbHVtbnM/OiBDb2x1bW5bXTtcclxuXHJcbiAgLyoqXHJcbiAgICogVXNlZCB0byBjaGFuZ2UgdGhlIGRpc3BsYXllZCB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIGNvbHVtbiBpbiBhbGwgcm93cy5cclxuICAgKlxyXG4gICAqIEVhY2ggYXJyYXkgZWxlbWVudCBtdXN0IGNvbnNpc3Qgb2YgYW4gaW5zdGFuY2Ugb2YgYSBbYGZvcm1hdHRlcmBdKGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2NoYXJ0L2ludGVyYWN0aXZlL2RvY3MvcmVmZXJlbmNlI2Zvcm1hdHRlcnMpXHJcbiAgICogYW5kIHRoZSBpbmRleCBvZiB0aGUgY29sdW1uIHlvdSB3YW50IHRoZSBmb3JtYXR0ZXIgdG8gZ2V0IGFwcGxpZWQgdG8uXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBwdWJsaWMgZm9ybWF0dGVycz86IEZvcm1hdHRlcltdO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgZGFzaGJvYXJkIGhhcyBjb21wbGV0ZWQgZHJhd2luZyBhbmQgaXMgcmVhZHkgdG8gYWNjZXB0IGNoYW5nZXMuXHJcbiAgICpcclxuICAgKiBUaGUgcmVhZHkgZXZlbnQgd2lsbCBhbHNvIGZpcmU6XHJcbiAgICogLSBhZnRlciB0aGUgY29tcGxldGlvbiBvZiBhIGRhc2hib2FyZCByZWZyZXNoIHRyaWdnZXJlZCBieSBhIHVzZXIgb3IgcHJvZ3JhbW1hdGljIGludGVyYWN0aW9uIHdpdGggb25lIG9mIHRoZSBjb250cm9scyxcclxuICAgKiAtIGFmdGVyIHJlZHJhd2luZyBhbnkgY2hhcnQgb24gdGhlIGRhc2hib2FyZC5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgcmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXRzIHdoZW4gYW4gZXJyb3Igb2NjdXJzIHdoZW4gYXR0ZW1wdGluZyB0byByZW5kZXIgdGhlIGRhc2hib2FyZC5cclxuICAgKiBPbmUgb3IgbW9yZSBvZiB0aGUgY29udHJvbHMgYW5kIGNoYXJ0cyB0aGF0IGFyZSBwYXJ0IG9mIHRoZSBkYXNoYm9hcmQgbWF5IGhhdmUgZmFpbGVkIHJlbmRlcmluZy5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD4oKTtcclxuXHJcbiAgQENvbnRlbnRDaGlsZHJlbihDb250cm9sV3JhcHBlckNvbXBvbmVudClcclxuICBwcml2YXRlIGNvbnRyb2xXcmFwcGVycyE6IFF1ZXJ5TGlzdDxDb250cm9sV3JhcHBlckNvbXBvbmVudD47XHJcblxyXG4gIHByaXZhdGUgZGFzaGJvYXJkPzogZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGFzaGJvYXJkO1xyXG4gIHByaXZhdGUgZGF0YVRhYmxlPzogZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlO1xyXG4gIHByaXZhdGUgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXHJcbiAgICBwcml2YXRlIGxvYWRlclNlcnZpY2U6IFNjcmlwdExvYWRlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGRhdGFUYWJsZVNlcnZpY2U6IERhdGFUYWJsZVNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5sb2FkQ2hhcnRQYWNrYWdlcygnY29udHJvbHMnKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmRhdGFUYWJsZSA9IHRoaXMuZGF0YVRhYmxlU2VydmljZS5jcmVhdGUodGhpcy5kYXRhLCB0aGlzLmNvbHVtbnMsIHRoaXMuZm9ybWF0dGVycyk7XHJcbiAgICAgIHRoaXMuY3JlYXRlRGFzaGJvYXJkKCk7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy5kYXRhIHx8IGNoYW5nZXMuY29sdW1ucyB8fCBjaGFuZ2VzLmZvcm1hdHRlcnMpIHtcclxuICAgICAgdGhpcy5kYXRhVGFibGUgPSB0aGlzLmRhdGFUYWJsZVNlcnZpY2UuY3JlYXRlKHRoaXMuZGF0YSwgdGhpcy5jb2x1bW5zLCB0aGlzLmZvcm1hdHRlcnMpO1xyXG4gICAgICB0aGlzLmRhc2hib2FyZCEuZHJhdyh0aGlzLmRhdGFUYWJsZSEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVEYXNoYm9hcmQoKTogdm9pZCB7XHJcbiAgICAvLyBUT0RPOiBUaGlzIHNob3VsZCBoYXBwZW4gaW4gdGhlIGNvbnRyb2wgd3JhcHBlclxyXG4gICAgLy8gSG93ZXZlciwgSSBkb24ndCB5ZXQga25vdyBob3cgdG8gZG8gdGhpcyBiZWNhdXNlIHRoZW4gYGJpbmQoKWAgd291bGQgZ2V0IGNhbGxlZCBtdWx0aXBsZSB0aW1lc1xyXG4gICAgLy8gZm9yIHRoZSBzYW1lIGNvbnRyb2wgaWYgc29tZXRoaW5nIGNoYW5nZXMuIFRoaXMgaXMgbm90IHN1cHBvcnRlZCBieSBnb29nbGUgY2hhcnRzIGFzIGZhciBhcyBJIGNhbiB0ZWxsXHJcbiAgICAvLyBmcm9tIHRoZWlyIHNvdXJjZSBjb2RlLlxyXG4gICAgY29uc3QgY29udHJvbFdyYXBwZXJzUmVhZHkkID0gdGhpcy5jb250cm9sV3JhcHBlcnMubWFwKGNvbnRyb2wgPT4gY29udHJvbC53cmFwcGVyUmVhZHkkKTtcclxuICAgIGNvbnN0IGNoYXJ0c1JlYWR5JCA9IHRoaXMuY29udHJvbFdyYXBwZXJzXHJcbiAgICAgIC5tYXAoY29udHJvbCA9PiBjb250cm9sLmZvcilcclxuICAgICAgLm1hcChjaGFydHMgPT4ge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoYXJ0cykpIHtcclxuICAgICAgICAgIC8vIENvbWJpbmVMYXRlc3Qgd2FpdHMgZm9yIGFsbCBvYnNlcnZhYmxlc1xyXG4gICAgICAgICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoY2hhcnRzLm1hcChjaGFydCA9PiBjaGFydC53cmFwcGVyUmVhZHkkKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBjaGFydHMud3JhcHBlclJlYWR5JDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIC8vIFdlIGhhdmUgdG8gd2FpdCBmb3IgYWxsIGNoYXJ0IHdyYXBwZXJzIGFuZCBjb250cm9sIHdyYXBwZXJzIHRvIGJlIGluaXRpYWxpemVkXHJcbiAgICAvLyBiZWZvcmUgd2UgY2FuIGNvbXBvc2UgdGhlbSB0b2dldGhlciB0byBjcmVhdGUgdGhlIGRhc2hib2FyZFxyXG4gICAgY29tYmluZUxhdGVzdChbLi4uY29udHJvbFdyYXBwZXJzUmVhZHkkLCAuLi5jaGFydHNSZWFkeSRdKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmRhc2hib2FyZCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXNoYm9hcmQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVCaW5kaW5ncygpO1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgIHRoaXMuZGFzaGJvYXJkLmRyYXcodGhpcy5kYXRhVGFibGUhKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWdpc3RlckV2ZW50cygpOiB2b2lkIHtcclxuICAgIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5yZW1vdmVBbGxMaXN0ZW5lcnModGhpcy5kYXNoYm9hcmQpO1xyXG5cclxuICAgIGNvbnN0IHJlZ2lzdGVyRGFzaEV2ZW50ID0gKG9iamVjdDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSA9PiB7XHJcbiAgICAgIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5hZGRMaXN0ZW5lcihvYmplY3QsIGV2ZW50TmFtZSwgY2FsbGJhY2spO1xyXG4gICAgfTtcclxuXHJcbiAgICByZWdpc3RlckRhc2hFdmVudCh0aGlzLmRhc2hib2FyZCwgJ3JlYWR5JywgKCkgPT4gdGhpcy5yZWFkeS5lbWl0KCkpO1xyXG4gICAgcmVnaXN0ZXJEYXNoRXZlbnQodGhpcy5kYXNoYm9hcmQsICdlcnJvcicsIChlcnJvcjogQ2hhcnRFcnJvckV2ZW50KSA9PiB0aGlzLmVycm9yLmVtaXQoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUJpbmRpbmdzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb250cm9sV3JhcHBlcnMuZm9yRWFjaChjb250cm9sID0+IHtcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29udHJvbC5mb3IpKSB7XHJcbiAgICAgICAgY29uc3QgY2hhcnRXcmFwcGVycyA9IGNvbnRyb2wuZm9yLm1hcChjaGFydCA9PiBjaGFydC5jaGFydFdyYXBwZXIpO1xyXG4gICAgICAgIHRoaXMuZGFzaGJvYXJkIS5iaW5kKGNvbnRyb2wuY29udHJvbFdyYXBwZXIsIGNoYXJ0V3JhcHBlcnMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZGFzaGJvYXJkIS5iaW5kKGNvbnRyb2wuY29udHJvbFdyYXBwZXIsIGNvbnRyb2wuZm9yLmNoYXJ0V3JhcHBlcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=