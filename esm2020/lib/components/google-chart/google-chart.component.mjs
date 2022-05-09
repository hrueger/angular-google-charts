import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Optional, Output } from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getPackageForChart } from '../../helpers/chart.helper';
import { DataTableService } from '../../services/data-table.service';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartType } from '../../types/chart-type';
import { DashboardComponent } from '../dashboard/dashboard.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/script-loader.service";
import * as i2 from "../../services/data-table.service";
import * as i3 from "../dashboard/dashboard.component";
export class GoogleChartComponent {
    constructor(element, scriptLoaderService, dataTableService, dashboard) {
        this.element = element;
        this.scriptLoaderService = scriptLoaderService;
        this.dataTableService = dataTableService;
        this.dashboard = dashboard;
        /**
         * The chart-specific options. All options listen in the Google Charts documentation applying
         * to the chart type specified can be used here.
         */
        this.options = {};
        /**
         * If this is set to `true`, the chart will be redrawn if the browser window is resized.
         * Defaults to `false` and should only be used when specifying the width or height of the chart
         * in percent.
         *
         * Note that this can impact performance.
         */
        this.dynamicResize = false;
        this.ready = new EventEmitter();
        this.error = new EventEmitter();
        this.select = new EventEmitter();
        this.mouseover = new EventEmitter();
        this.mouseleave = new EventEmitter();
        this.wrapperReadySubject = new ReplaySubject(1);
        this.initialized = false;
        this.eventListeners = new Map();
    }
    get chart() {
        return this.chartWrapper.getChart();
    }
    get wrapperReady$() {
        return this.wrapperReadySubject.asObservable();
    }
    get chartWrapper() {
        if (!this.wrapper) {
            throw new Error('Trying to access the chart wrapper before it was fully initialized');
        }
        return this.wrapper;
    }
    set chartWrapper(wrapper) {
        this.wrapper = wrapper;
        this.drawChart();
    }
    ngOnInit() {
        // We don't need to load any chart packages, the chart wrapper will handle this for us
        this.scriptLoaderService.loadChartPackages(getPackageForChart(this.type)).subscribe(() => {
            this.dataTable = this.dataTableService.create(this.data, this.columns, this.formatters);
            // Only ever create the wrapper once to allow animations to happen when something changes.
            this.wrapper = new google.visualization.ChartWrapper({
                container: this.element.nativeElement,
                chartType: this.type,
                dataTable: this.dataTable,
                options: this.mergeOptions()
            });
            this.registerChartEvents();
            this.wrapperReadySubject.next(this.wrapper);
            this.initialized = true;
            this.drawChart();
        });
    }
    ngOnChanges(changes) {
        if (changes.dynamicResize) {
            this.updateResizeListener();
        }
        if (this.initialized) {
            let shouldRedraw = false;
            if (changes.data || changes.columns || changes.formatters) {
                this.dataTable = this.dataTableService.create(this.data, this.columns, this.formatters);
                this.wrapper.setDataTable(this.dataTable);
                shouldRedraw = true;
            }
            if (changes.type) {
                this.wrapper.setChartType(this.type);
                shouldRedraw = true;
            }
            if (changes.options || changes.width || changes.height || changes.title) {
                this.wrapper.setOptions(this.mergeOptions());
                shouldRedraw = true;
            }
            if (shouldRedraw) {
                this.drawChart();
            }
        }
    }
    ngOnDestroy() {
        this.unsubscribeToResizeIfSubscribed();
    }
    /**
     * For listening to events other than the most common ones (available via Output properties).
     *
     * Can be called after the chart emits that it's "ready".
     *
     * Returns a handle that can be used for `removeEventListener`.
     */
    addEventListener(eventName, callback) {
        const handle = this.registerChartEvent(this.chart, eventName, callback);
        this.eventListeners.set(handle, { eventName, callback, handle });
        return handle;
    }
    removeEventListener(handle) {
        const entry = this.eventListeners.get(handle);
        if (entry) {
            google.visualization.events.removeListener(entry.handle);
            this.eventListeners.delete(handle);
        }
    }
    updateResizeListener() {
        this.unsubscribeToResizeIfSubscribed();
        if (this.dynamicResize) {
            this.resizeSubscription = fromEvent(window, 'resize', { passive: true })
                .pipe(debounceTime(100))
                .subscribe(() => {
                if (this.initialized) {
                    this.drawChart();
                }
            });
        }
    }
    unsubscribeToResizeIfSubscribed() {
        if (this.resizeSubscription != null) {
            this.resizeSubscription.unsubscribe();
            this.resizeSubscription = undefined;
        }
    }
    mergeOptions() {
        return {
            title: this.title,
            width: this.width,
            height: this.height,
            ...this.options
        };
    }
    registerChartEvents() {
        google.visualization.events.removeAllListeners(this.wrapper);
        this.registerChartEvent(this.wrapper, 'ready', () => {
            // This could also be done by checking if we already subscribed to the events
            google.visualization.events.removeAllListeners(this.chart);
            this.registerChartEvent(this.chart, 'onmouseover', (event) => this.mouseover.emit(event));
            this.registerChartEvent(this.chart, 'onmouseout', (event) => this.mouseleave.emit(event));
            this.registerChartEvent(this.chart, 'select', () => {
                const selection = this.chart.getSelection();
                this.select.emit({ selection });
            });
            this.eventListeners.forEach(x => (x.handle = this.registerChartEvent(this.chart, x.eventName, x.callback)));
            this.ready.emit({ chart: this.chart });
        });
        this.registerChartEvent(this.wrapper, 'error', (error) => this.error.emit(error));
    }
    registerChartEvent(object, eventName, callback) {
        return google.visualization.events.addListener(object, eventName, callback);
    }
    drawChart() {
        if (this.dashboard != null) {
            // If this chart is part of a dashboard, the dashboard takes care of drawing
            return;
        }
        this.wrapper.draw();
    }
}
GoogleChartComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: GoogleChartComponent, deps: [{ token: i0.ElementRef }, { token: i1.ScriptLoaderService }, { token: i2.DataTableService }, { token: i3.DashboardComponent, optional: true }], target: i0.ɵɵFactoryTarget.Component });
GoogleChartComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: GoogleChartComponent, selector: "google-chart", inputs: { type: "type", data: "data", columns: "columns", title: "title", width: "width", height: "height", options: "options", formatters: "formatters", dynamicResize: "dynamicResize" }, outputs: { ready: "ready", error: "error", select: "select", mouseover: "mouseover", mouseleave: "mouseleave" }, host: { classAttribute: "google-chart" }, exportAs: ["googleChart"], usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: GoogleChartComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'google-chart',
                    template: '',
                    styles: [':host { width: fit-content; display: block; }'],
                    host: { class: 'google-chart' },
                    exportAs: 'googleChart',
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ScriptLoaderService }, { type: i2.DataTableService }, { type: i3.DashboardComponent, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { type: [{
                type: Input
            }], data: [{
                type: Input
            }], columns: [{
                type: Input
            }], title: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], options: [{
                type: Input
            }], formatters: [{
                type: Input
            }], dynamicResize: [{
                type: Input
            }], ready: [{
                type: Output
            }], error: [{
                type: Output
            }], select: [{
                type: Output
            }], mouseover: [{
                type: Output
            }], mouseleave: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvYW5ndWxhci1nb29nbGUtY2hhcnRzL3NyYy9saWIvY29tcG9uZW50cy9nb29nbGUtY2hhcnQvZ29vZ2xlLWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQWMsYUFBYSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDckUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBVW5ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7OztBQVV0RSxNQUFNLE9BQU8sb0JBQW9CO0lBaUcvQixZQUNVLE9BQW1CLEVBQ25CLG1CQUF3QyxFQUN4QyxnQkFBa0MsRUFDdEIsU0FBOEI7UUFIMUMsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDdEIsY0FBUyxHQUFULFNBQVMsQ0FBcUI7UUFyRHBEOzs7V0FHRztRQUVJLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFXNUI7Ozs7OztXQU1HO1FBRUksa0JBQWEsR0FBRyxLQUFL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LE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBSZXBsYXlTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgZ2V0UGFja2FnZUZvckNoYXJ0IH0gZnJvbSAnLi4vLi4vaGVscGVycy9jaGFydC5oZWxwZXInO1xuaW1wb3J0IHsgRGF0YVRhYmxlU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RhdGEtdGFibGUuc2VydmljZSc7XG5pbXBvcnQgeyBTY3JpcHRMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcbmltcG9ydCB7IENoYXJ0VHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL2NoYXJ0LXR5cGUnO1xuaW1wb3J0IHtcbiAgQ2hhcnRFcnJvckV2ZW50LFxuICBDaGFydE1vdXNlTGVhdmVFdmVudCxcbiAgQ2hhcnRNb3VzZU92ZXJFdmVudCxcbiAgQ2hhcnRSZWFkeUV2ZW50LFxuICBDaGFydFNlbGVjdGlvbkNoYW5nZWRFdmVudFxufSBmcm9tICcuLi8uLi90eXBlcy9ldmVudHMnO1xuaW1wb3J0IHsgRm9ybWF0dGVyIH0gZnJvbSAnLi4vLi4vdHlwZXMvZm9ybWF0dGVyJztcbmltcG9ydCB7IENoYXJ0QmFzZSwgQ29sdW1uLCBSb3cgfSBmcm9tICcuLi9jaGFydC1iYXNlL2NoYXJ0LWJhc2UuY29tcG9uZW50JztcbmltcG9ydCB7IERhc2hib2FyZENvbXBvbmVudCB9IGZyb20gJy4uL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ29vZ2xlLWNoYXJ0JyxcbiAgdGVtcGxhdGU6ICcnLFxuICBzdHlsZXM6IFsnOmhvc3QgeyB3aWR0aDogZml0LWNvbnRlbnQ7IGRpc3BsYXk6IGJsb2NrOyB9J10sXG4gIGhvc3Q6IHsgY2xhc3M6ICdnb29nbGUtY2hhcnQnIH0sXG4gIGV4cG9ydEFzOiAnZ29vZ2xlQ2hhcnQnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBHb29nbGVDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIENoYXJ0QmFzZSwgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgY2hhcnQgdG8gY3JlYXRlLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIHR5cGUhOiBDaGFydFR5cGU7XG5cbiAgLyoqXG4gICAqIERhdGEgdXNlZCB0byBpbml0aWFsaXplIHRoZSB0YWJsZS5cbiAgICpcbiAgICogVGhpcyBtdXN0IGFsc28gY29udGFpbiBhbGwgcm9sZXMgdGhhdCBhcmUgc2V0IGluIHRoZSBgY29sdW1uc2AgcHJvcGVydHkuXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgZGF0YSE6IFJvd1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgY29sdW1ucyB0aGUgYGRhdGFgIGNvbnNpc3RzIG9mLlxuICAgKiBUaGUgbGVuZ3RoIG9mIHRoaXMgYXJyYXkgbXVzdCBtYXRjaCB0aGUgbGVuZ3RoIG9mIGVhY2ggcm93IGluIHRoZSBgZGF0YWAgb2JqZWN0LlxuICAgKlxuICAgKiBJZiB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vY2hhcnQvaW50ZXJhY3RpdmUvZG9jcy9yb2xlcyByb2xlc30gc2hvdWxkIGJlIGFwcGxpZWQsIHRoZXkgbXVzdCBiZSBpbmNsdWRlZCBpbiB0aGlzIGFycmF5IGFzIHdlbGwuXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgY29sdW1ucz86IENvbHVtbltdO1xuXG4gIC8qKlxuICAgKiBBIGNvbnZlbmllbmNlIHByb3BlcnR5IHVzZWQgdG8gc2V0IHRoZSB0aXRsZSBvZiB0aGUgY2hhcnQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGFsc28gYmUgc2V0IHVzaW5nIGBvcHRpb25zLnRpdGxlYCwgd2hpY2gsIGlmIGV4aXN0YW50LCB3aWxsIG92ZXJ3cml0ZSB0aGlzIHZhbHVlLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIHRpdGxlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGNvbnZlbmllbmNlIHByb3BlcnR5IHVzZWQgdG8gc2V0IHRoZSB3aWR0aCBvZiB0aGUgY2hhcnQgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBUaGlzIGNhbiBhbHNvIGJlIHNldCB1c2luZyBgb3B0aW9ucy53aWR0aGAsIHdoaWNoLCBpZiBleGlzdGFudCwgd2lsbCBvdmVyd3JpdGUgdGhpcyB2YWx1ZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB3aWR0aD86IG51bWJlcjtcblxuICAvKipcbiAgICogQSBjb252ZW5pZW5jZSBwcm9wZXJ0eSB1c2VkIHRvIHNldCB0aGUgaGVpZ2h0IG9mIHRoZSBjaGFydCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIFRoaXMgY2FuIGFsc28gYmUgc2V0IHVzaW5nIGBvcHRpb25zLmhlaWdodGAsIHdoaWNoLCBpZiBleGlzdGFudCwgd2lsbCBvdmVyd3JpdGUgdGhpcyB2YWx1ZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBoZWlnaHQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBjaGFydC1zcGVjaWZpYyBvcHRpb25zLiBBbGwgb3B0aW9ucyBsaXN0ZW4gaW4gdGhlIEdvb2dsZSBDaGFydHMgZG9jdW1lbnRhdGlvbiBhcHBseWluZ1xuICAgKiB0byB0aGUgY2hhcnQgdHlwZSBzcGVjaWZpZWQgY2FuIGJlIHVzZWQgaGVyZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBvcHRpb25zOiBvYmplY3QgPSB7fTtcblxuICAvKipcbiAgICogVXNlZCB0byBjaGFuZ2UgdGhlIGRpc3BsYXllZCB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIGNvbHVtbiBpbiBhbGwgcm93cy5cbiAgICpcbiAgICogRWFjaCBhcnJheSBlbGVtZW50IG11c3QgY29uc2lzdCBvZiBhbiBpbnN0YW5jZSBvZiBhIFtgZm9ybWF0dGVyYF0oaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vY2hhcnQvaW50ZXJhY3RpdmUvZG9jcy9yZWZlcmVuY2UjZm9ybWF0dGVycylcbiAgICogYW5kIHRoZSBpbmRleCBvZiB0aGUgY29sdW1uIHlvdSB3YW50IHRoZSBmb3JtYXR0ZXIgdG8gZ2V0IGFwcGxpZWQgdG8uXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgZm9ybWF0dGVycz86IEZvcm1hdHRlcltdO1xuXG4gIC8qKlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byBgdHJ1ZWAsIHRoZSBjaGFydCB3aWxsIGJlIHJlZHJhd24gaWYgdGhlIGJyb3dzZXIgd2luZG93IGlzIHJlc2l6ZWQuXG4gICAqIERlZmF1bHRzIHRvIGBmYWxzZWAgYW5kIHNob3VsZCBvbmx5IGJlIHVzZWQgd2hlbiBzcGVjaWZ5aW5nIHRoZSB3aWR0aCBvciBoZWlnaHQgb2YgdGhlIGNoYXJ0XG4gICAqIGluIHBlcmNlbnQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGlzIGNhbiBpbXBhY3QgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgZHluYW1pY1Jlc2l6ZSA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0UmVhZHlFdmVudD4oKTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEVycm9yRXZlbnQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0U2VsZWN0aW9uQ2hhbmdlZEV2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgbW91c2VvdmVyID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydE1vdXNlT3ZlckV2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgbW91c2VsZWF2ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRNb3VzZUxlYXZlRXZlbnQ+KCk7XG5cbiAgcHJpdmF0ZSByZXNpemVTdWJzY3JpcHRpb24/OiBTdWJzY3JpcHRpb247XG5cbiAgcHJpdmF0ZSBkYXRhVGFibGU6IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSB3cmFwcGVyOiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgd3JhcHBlclJlYWR5U3ViamVjdCA9IG5ldyBSZXBsYXlTdWJqZWN0PGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcj4oMSk7XG4gIHByaXZhdGUgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBldmVudExpc3RlbmVycyA9IG5ldyBNYXA8YW55LCB7IGV2ZW50TmFtZTogc3RyaW5nOyBjYWxsYmFjazogRnVuY3Rpb247IGhhbmRsZTogYW55IH0+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgc2NyaXB0TG9hZGVyU2VydmljZTogU2NyaXB0TG9hZGVyU2VydmljZSxcbiAgICBwcml2YXRlIGRhdGFUYWJsZVNlcnZpY2U6IERhdGFUYWJsZVNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkYXNoYm9hcmQ/OiBEYXNoYm9hcmRDb21wb25lbnRcbiAgKSB7fVxuXG4gIHB1YmxpYyBnZXQgY2hhcnQoKTogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRCYXNlIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuY2hhcnRXcmFwcGVyLmdldENoYXJ0KCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHdyYXBwZXJSZWFkeSQoKTogT2JzZXJ2YWJsZTxnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXI+IHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVyUmVhZHlTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgcHVibGljIGdldCBjaGFydFdyYXBwZXIoKTogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyIHtcbiAgICBpZiAoIXRoaXMud3JhcHBlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIHRoZSBjaGFydCB3cmFwcGVyIGJlZm9yZSBpdCB3YXMgZnVsbHkgaW5pdGlhbGl6ZWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy53cmFwcGVyO1xuICB9XG5cbiAgcHVibGljIHNldCBjaGFydFdyYXBwZXIod3JhcHBlcjogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKSB7XG4gICAgdGhpcy53cmFwcGVyID0gd3JhcHBlcjtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gbG9hZCBhbnkgY2hhcnQgcGFja2FnZXMsIHRoZSBjaGFydCB3cmFwcGVyIHdpbGwgaGFuZGxlIHRoaXMgZm9yIHVzXG4gICAgdGhpcy5zY3JpcHRMb2FkZXJTZXJ2aWNlLmxvYWRDaGFydFBhY2thZ2VzKGdldFBhY2thZ2VGb3JDaGFydCh0aGlzLnR5cGUpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5kYXRhVGFibGUgPSB0aGlzLmRhdGFUYWJsZVNlcnZpY2UuY3JlYXRlKHRoaXMuZGF0YSwgdGhpcy5jb2x1bW5zLCB0aGlzLmZvcm1hdHRlcnMpO1xuXG4gICAgICAvLyBPbmx5IGV2ZXIgY3JlYXRlIHRoZSB3cmFwcGVyIG9uY2UgdG8gYWxsb3cgYW5pbWF0aW9ucyB0byBoYXBwZW4gd2hlbiBzb21ldGhpbmcgY2hhbmdlcy5cbiAgICAgIHRoaXMud3JhcHBlciA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIoe1xuICAgICAgICBjb250YWluZXI6IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICBjaGFydFR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgZGF0YVRhYmxlOiB0aGlzLmRhdGFUYWJsZSxcbiAgICAgICAgb3B0aW9uczogdGhpcy5tZXJnZU9wdGlvbnMoKVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50cygpO1xuXG4gICAgICB0aGlzLndyYXBwZXJSZWFkeVN1YmplY3QubmV4dCh0aGlzLndyYXBwZXIpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmR5bmFtaWNSZXNpemUpIHtcbiAgICAgIHRoaXMudXBkYXRlUmVzaXplTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgbGV0IHNob3VsZFJlZHJhdyA9IGZhbHNlO1xuICAgICAgaWYgKGNoYW5nZXMuZGF0YSB8fCBjaGFuZ2VzLmNvbHVtbnMgfHwgY2hhbmdlcy5mb3JtYXR0ZXJzKSB7XG4gICAgICAgIHRoaXMuZGF0YVRhYmxlID0gdGhpcy5kYXRhVGFibGVTZXJ2aWNlLmNyZWF0ZSh0aGlzLmRhdGEsIHRoaXMuY29sdW1ucywgdGhpcy5mb3JtYXR0ZXJzKTtcbiAgICAgICAgdGhpcy53cmFwcGVyIS5zZXREYXRhVGFibGUodGhpcy5kYXRhVGFibGUhKTtcbiAgICAgICAgc2hvdWxkUmVkcmF3ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXMudHlwZSkge1xuICAgICAgICB0aGlzLndyYXBwZXIhLnNldENoYXJ0VHlwZSh0aGlzLnR5cGUpO1xuICAgICAgICBzaG91bGRSZWRyYXcgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlcy5vcHRpb25zIHx8IGNoYW5nZXMud2lkdGggfHwgY2hhbmdlcy5oZWlnaHQgfHwgY2hhbmdlcy50aXRsZSkge1xuICAgICAgICB0aGlzLndyYXBwZXIhLnNldE9wdGlvbnModGhpcy5tZXJnZU9wdGlvbnMoKSk7XG4gICAgICAgIHNob3VsZFJlZHJhdyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChzaG91bGRSZWRyYXcpIHtcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy51bnN1YnNjcmliZVRvUmVzaXplSWZTdWJzY3JpYmVkKCk7XG4gIH1cblxuICAvKipcbiAgICogRm9yIGxpc3RlbmluZyB0byBldmVudHMgb3RoZXIgdGhhbiB0aGUgbW9zdCBjb21tb24gb25lcyAoYXZhaWxhYmxlIHZpYSBPdXRwdXQgcHJvcGVydGllcykuXG4gICAqXG4gICAqIENhbiBiZSBjYWxsZWQgYWZ0ZXIgdGhlIGNoYXJ0IGVtaXRzIHRoYXQgaXQncyBcInJlYWR5XCIuXG4gICAqXG4gICAqIFJldHVybnMgYSBoYW5kbGUgdGhhdCBjYW4gYmUgdXNlZCBmb3IgYHJlbW92ZUV2ZW50TGlzdGVuZXJgLlxuICAgKi9cbiAgcHVibGljIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IGFueSB7XG4gICAgY29uc3QgaGFuZGxlID0gdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy5jaGFydCwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5zZXQoaGFuZGxlLCB7IGV2ZW50TmFtZSwgY2FsbGJhY2ssIGhhbmRsZSB9KTtcbiAgICByZXR1cm4gaGFuZGxlO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuZXZlbnRMaXN0ZW5lcnMuZ2V0KGhhbmRsZSk7XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHMucmVtb3ZlTGlzdGVuZXIoZW50cnkuaGFuZGxlKTtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMuZGVsZXRlKGhhbmRsZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVSZXNpemVMaXN0ZW5lcigpIHtcbiAgICB0aGlzLnVuc3Vic2NyaWJlVG9SZXNpemVJZlN1YnNjcmliZWQoKTtcblxuICAgIGlmICh0aGlzLmR5bmFtaWNSZXNpemUpIHtcbiAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxuICAgICAgICAucGlwZShkZWJvdW5jZVRpbWUoMTAwKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVuc3Vic2NyaWJlVG9SZXNpemVJZlN1YnNjcmliZWQoKSB7XG4gICAgaWYgKHRoaXMucmVzaXplU3Vic2NyaXB0aW9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1lcmdlT3B0aW9ucygpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyQ2hhcnRFdmVudHMoKSB7XG4gICAgZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzLnJlbW92ZUFsbExpc3RlbmVycyh0aGlzLndyYXBwZXIpO1xuXG4gICAgdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy53cmFwcGVyLCAncmVhZHknLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIGNvdWxkIGFsc28gYmUgZG9uZSBieSBjaGVja2luZyBpZiB3ZSBhbHJlYWR5IHN1YnNjcmliZWQgdG8gdGhlIGV2ZW50c1xuICAgICAgZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzLnJlbW92ZUFsbExpc3RlbmVycyh0aGlzLmNoYXJ0KTtcbiAgICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMuY2hhcnQsICdvbm1vdXNlb3ZlcicsIChldmVudDogQ2hhcnRNb3VzZU92ZXJFdmVudCkgPT4gdGhpcy5tb3VzZW92ZXIuZW1pdChldmVudCkpO1xuICAgICAgdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy5jaGFydCwgJ29ubW91c2VvdXQnLCAoZXZlbnQ6IENoYXJ0TW91c2VMZWF2ZUV2ZW50KSA9PiB0aGlzLm1vdXNlbGVhdmUuZW1pdChldmVudCkpO1xuICAgICAgdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy5jaGFydCwgJ3NlbGVjdCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5jaGFydCEuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0LmVtaXQoeyBzZWxlY3Rpb24gfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCh4ID0+ICh4LmhhbmRsZSA9IHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMuY2hhcnQsIHguZXZlbnROYW1lLCB4LmNhbGxiYWNrKSkpO1xuXG4gICAgICB0aGlzLnJlYWR5LmVtaXQoeyBjaGFydDogdGhpcy5jaGFydCEgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLndyYXBwZXIsICdlcnJvcicsIChlcnJvcjogQ2hhcnRFcnJvckV2ZW50KSA9PiB0aGlzLmVycm9yLmVtaXQoZXJyb3IpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydEV2ZW50KG9iamVjdDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKTogYW55IHtcbiAgICByZXR1cm4gZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzLmFkZExpc3RlbmVyKG9iamVjdCwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdDaGFydCgpIHtcbiAgICBpZiAodGhpcy5kYXNoYm9hcmQgIT0gbnVsbCkge1xuICAgICAgLy8gSWYgdGhpcyBjaGFydCBpcyBwYXJ0IG9mIGEgZGFzaGJvYXJkLCB0aGUgZGFzaGJvYXJkIHRha2VzIGNhcmUgb2YgZHJhd2luZ1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMud3JhcHBlciEuZHJhdygpO1xuICB9XG59XG4iXX0=