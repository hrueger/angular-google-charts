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
GoogleChartComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: GoogleChartComponent, deps: [{ token: i0.ElementRef }, { token: i1.ScriptLoaderService }, { token: i2.DataTableService }, { token: i3.DashboardComponent, optional: true }], target: i0.ɵɵFactoryTarget.Component });
GoogleChartComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: GoogleChartComponent, selector: "google-chart", inputs: { type: "type", data: "data", columns: "columns", title: "title", width: "width", height: "height", options: "options", formatters: "formatters", dynamicResize: "dynamicResize" }, outputs: { ready: "ready", error: "error", select: "select", mouseover: "mouseover", mouseleave: "mouseleave" }, host: { classAttribute: "google-chart" }, exportAs: ["googleChart"], usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: GoogleChartComponent, decorators: [{
            type: Component,
            args: [{ selector: 'google-chart', template: '', host: { class: 'google-chart' }, exportAs: 'googleChart', changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvYW5ndWxhci1nb29nbGUtY2hhcnRzL3NyYy9saWIvY29tcG9uZW50cy9nb29nbGUtY2hhcnQvZ29vZ2xlLWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQWMsYUFBYSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDckUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBVW5ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7OztBQVV0RSxNQUFNLE9BQU8sb0JBQW9CO0lBaUcvQixZQUNVLE9BQW1CLEVBQ25CLG1CQUF3QyxFQUN4QyxnQkFBa0MsRUFDdEIsU0FBOEI7UUFIMUMsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDdEIsY0FBUyxHQUFULFNBQVMsQ0FBcUI7UUFyRHBEOzs7V0FHRztRQUVJLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFXNUI7Ozs7OztXQU1HO1FBRUksa0JBQWEsR0FBRyxLQUFL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LENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxNQUFXLEVBQUUsU0FBaUIsRUFBRSxRQUFrQjtRQUMzRSxPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFTyxTQUFTO1FBQ2YsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtZQUMxQiw0RUFBNEU7WUFDNUUsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLE9BQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDOztpSEF0UVUsb0JBQW9CO3FHQUFwQixvQkFBb0IsMmJBTnJCLEVBQUU7MkZBTUQsb0JBQW9CO2tCQVJoQyxTQUFTOytCQUNFLGNBQWMsWUFDZCxFQUFFLFFBRU4sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLFlBQ3JCLGFBQWEsbUJBQ04sdUJBQXVCLENBQUMsTUFBTTs7MEJBdUc1QyxRQUFROzRDQWhHSixJQUFJO3NCQURWLEtBQUs7Z0JBU0MsSUFBSTtzQkFEVixLQUFLO2dCQVVDLE9BQU87c0JBRGIsS0FBSztnQkFTQyxLQUFLO3NCQURYLEtBQUs7Z0JBU0MsS0FBSztzQkFEWCxLQUFLO2dCQVNDLE1BQU07c0JBRFosS0FBSztnQkFRQyxPQUFPO3NCQURiLEtBQUs7Z0JBVUMsVUFBVTtzQkFEaEIsS0FBSztnQkFXQyxhQUFhO3NCQURuQixLQUFLO2dCQUlDLEtBQUs7c0JBRFgsTUFBTTtnQkFJQSxLQUFLO3NCQURYLE1BQU07Z0JBSUEsTUFBTTtzQkFEWixNQUFNO2dCQUlBLFNBQVM7c0JBRGYsTUFBTTtnQkFJQSxVQUFVO3NCQURoQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSW5wdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3B0aW9uYWwsXHJcbiAgT3V0cHV0LFxyXG4gIFNpbXBsZUNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBSZXBsYXlTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuaW1wb3J0IHsgZ2V0UGFja2FnZUZvckNoYXJ0IH0gZnJvbSAnLi4vLi4vaGVscGVycy9jaGFydC5oZWxwZXInO1xyXG5pbXBvcnQgeyBEYXRhVGFibGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZGF0YS10YWJsZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2NyaXB0TG9hZGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NjcmlwdC1sb2FkZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENoYXJ0VHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL2NoYXJ0LXR5cGUnO1xyXG5pbXBvcnQge1xyXG4gIENoYXJ0RXJyb3JFdmVudCxcclxuICBDaGFydE1vdXNlTGVhdmVFdmVudCxcclxuICBDaGFydE1vdXNlT3ZlckV2ZW50LFxyXG4gIENoYXJ0UmVhZHlFdmVudCxcclxuICBDaGFydFNlbGVjdGlvbkNoYW5nZWRFdmVudFxyXG59IGZyb20gJy4uLy4uL3R5cGVzL2V2ZW50cyc7XHJcbmltcG9ydCB7IEZvcm1hdHRlciB9IGZyb20gJy4uLy4uL3R5cGVzL2Zvcm1hdHRlcic7XHJcbmltcG9ydCB7IENoYXJ0QmFzZSwgQ29sdW1uLCBSb3cgfSBmcm9tICcuLi9jaGFydC1iYXNlL2NoYXJ0LWJhc2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGFzaGJvYXJkQ29tcG9uZW50IH0gZnJvbSAnLi4vZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnb29nbGUtY2hhcnQnLFxyXG4gIHRlbXBsYXRlOiAnJyxcclxuICBzdHlsZXM6IFsnOmhvc3QgeyB3aWR0aDogZml0LWNvbnRlbnQ7IGRpc3BsYXk6IGJsb2NrOyB9J10sXHJcbiAgaG9zdDogeyBjbGFzczogJ2dvb2dsZS1jaGFydCcgfSxcclxuICBleHBvcnRBczogJ2dvb2dsZUNoYXJ0JyxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgR29vZ2xlQ2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBDaGFydEJhc2UsIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xyXG4gIC8qKlxyXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBjaGFydCB0byBjcmVhdGUuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBwdWJsaWMgdHlwZSE6IENoYXJ0VHlwZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGF0YSB1c2VkIHRvIGluaXRpYWxpemUgdGhlIHRhYmxlLlxyXG4gICAqXHJcbiAgICogVGhpcyBtdXN0IGFsc28gY29udGFpbiBhbGwgcm9sZXMgdGhhdCBhcmUgc2V0IGluIHRoZSBgY29sdW1uc2AgcHJvcGVydHkuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBwdWJsaWMgZGF0YSE6IFJvd1tdO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgY29sdW1ucyB0aGUgYGRhdGFgIGNvbnNpc3RzIG9mLlxyXG4gICAqIFRoZSBsZW5ndGggb2YgdGhpcyBhcnJheSBtdXN0IG1hdGNoIHRoZSBsZW5ndGggb2YgZWFjaCByb3cgaW4gdGhlIGBkYXRhYCBvYmplY3QuXHJcbiAgICpcclxuICAgKiBJZiB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vY2hhcnQvaW50ZXJhY3RpdmUvZG9jcy9yb2xlcyByb2xlc30gc2hvdWxkIGJlIGFwcGxpZWQsIHRoZXkgbXVzdCBiZSBpbmNsdWRlZCBpbiB0aGlzIGFycmF5IGFzIHdlbGwuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBwdWJsaWMgY29sdW1ucz86IENvbHVtbltdO1xyXG5cclxuICAvKipcclxuICAgKiBBIGNvbnZlbmllbmNlIHByb3BlcnR5IHVzZWQgdG8gc2V0IHRoZSB0aXRsZSBvZiB0aGUgY2hhcnQuXHJcbiAgICpcclxuICAgKiBUaGlzIGNhbiBhbHNvIGJlIHNldCB1c2luZyBgb3B0aW9ucy50aXRsZWAsIHdoaWNoLCBpZiBleGlzdGFudCwgd2lsbCBvdmVyd3JpdGUgdGhpcyB2YWx1ZS5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHB1YmxpYyB0aXRsZT86IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogQSBjb252ZW5pZW5jZSBwcm9wZXJ0eSB1c2VkIHRvIHNldCB0aGUgd2lkdGggb2YgdGhlIGNoYXJ0IGluIHBpeGVscy5cclxuICAgKlxyXG4gICAqIFRoaXMgY2FuIGFsc28gYmUgc2V0IHVzaW5nIGBvcHRpb25zLndpZHRoYCwgd2hpY2gsIGlmIGV4aXN0YW50LCB3aWxsIG92ZXJ3cml0ZSB0aGlzIHZhbHVlLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIHdpZHRoPzogbnVtYmVyO1xyXG5cclxuICAvKipcclxuICAgKiBBIGNvbnZlbmllbmNlIHByb3BlcnR5IHVzZWQgdG8gc2V0IHRoZSBoZWlnaHQgb2YgdGhlIGNoYXJ0IGluIHBpeGVscy5cclxuICAgKlxyXG4gICAqIFRoaXMgY2FuIGFsc28gYmUgc2V0IHVzaW5nIGBvcHRpb25zLmhlaWdodGAsIHdoaWNoLCBpZiBleGlzdGFudCwgd2lsbCBvdmVyd3JpdGUgdGhpcyB2YWx1ZS5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHB1YmxpYyBoZWlnaHQ/OiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBjaGFydC1zcGVjaWZpYyBvcHRpb25zLiBBbGwgb3B0aW9ucyBsaXN0ZW4gaW4gdGhlIEdvb2dsZSBDaGFydHMgZG9jdW1lbnRhdGlvbiBhcHBseWluZ1xyXG4gICAqIHRvIHRoZSBjaGFydCB0eXBlIHNwZWNpZmllZCBjYW4gYmUgdXNlZCBoZXJlLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIG9wdGlvbnM6IG9iamVjdCA9IHt9O1xyXG5cclxuICAvKipcclxuICAgKiBVc2VkIHRvIGNoYW5nZSB0aGUgZGlzcGxheWVkIHZhbHVlIG9mIHRoZSBzcGVjaWZpZWQgY29sdW1uIGluIGFsbCByb3dzLlxyXG4gICAqXHJcbiAgICogRWFjaCBhcnJheSBlbGVtZW50IG11c3QgY29uc2lzdCBvZiBhbiBpbnN0YW5jZSBvZiBhIFtgZm9ybWF0dGVyYF0oaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vY2hhcnQvaW50ZXJhY3RpdmUvZG9jcy9yZWZlcmVuY2UjZm9ybWF0dGVycylcclxuICAgKiBhbmQgdGhlIGluZGV4IG9mIHRoZSBjb2x1bW4geW91IHdhbnQgdGhlIGZvcm1hdHRlciB0byBnZXQgYXBwbGllZCB0by5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHB1YmxpYyBmb3JtYXR0ZXJzPzogRm9ybWF0dGVyW107XHJcblxyXG4gIC8qKlxyXG4gICAqIElmIHRoaXMgaXMgc2V0IHRvIGB0cnVlYCwgdGhlIGNoYXJ0IHdpbGwgYmUgcmVkcmF3biBpZiB0aGUgYnJvd3NlciB3aW5kb3cgaXMgcmVzaXplZC5cclxuICAgKiBEZWZhdWx0cyB0byBgZmFsc2VgIGFuZCBzaG91bGQgb25seSBiZSB1c2VkIHdoZW4gc3BlY2lmeWluZyB0aGUgd2lkdGggb3IgaGVpZ2h0IG9mIHRoZSBjaGFydFxyXG4gICAqIGluIHBlcmNlbnQuXHJcbiAgICpcclxuICAgKiBOb3RlIHRoYXQgdGhpcyBjYW4gaW1wYWN0IHBlcmZvcm1hbmNlLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIGR5bmFtaWNSZXNpemUgPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIHJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydFJlYWR5RXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHB1YmxpYyBlcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydFNlbGVjdGlvbkNoYW5nZWRFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIG1vdXNlb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRNb3VzZU92ZXJFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIG1vdXNlbGVhdmUgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0TW91c2VMZWF2ZUV2ZW50PigpO1xyXG5cclxuICBwcml2YXRlIHJlc2l6ZVN1YnNjcmlwdGlvbj86IFN1YnNjcmlwdGlvbjtcclxuXHJcbiAgcHJpdmF0ZSBkYXRhVGFibGU6IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSB8IHVuZGVmaW5lZDtcclxuICBwcml2YXRlIHdyYXBwZXI6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlciB8IHVuZGVmaW5lZDtcclxuICBwcml2YXRlIHdyYXBwZXJSZWFkeVN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXI+KDEpO1xyXG4gIHByaXZhdGUgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICBwcml2YXRlIGV2ZW50TGlzdGVuZXJzID0gbmV3IE1hcDxhbnksIHsgZXZlbnROYW1lOiBzdHJpbmc7IGNhbGxiYWNrOiBGdW5jdGlvbjsgaGFuZGxlOiBhbnkgfT4oKTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXHJcbiAgICBwcml2YXRlIHNjcmlwdExvYWRlclNlcnZpY2U6IFNjcmlwdExvYWRlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGRhdGFUYWJsZVNlcnZpY2U6IERhdGFUYWJsZVNlcnZpY2UsXHJcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRhc2hib2FyZD86IERhc2hib2FyZENvbXBvbmVudFxyXG4gICkge31cclxuXHJcbiAgcHVibGljIGdldCBjaGFydCgpOiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydEJhc2UgfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLmNoYXJ0V3JhcHBlci5nZXRDaGFydCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCB3cmFwcGVyUmVhZHkkKCk6IE9ic2VydmFibGU8Z29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyPiB7XHJcbiAgICByZXR1cm4gdGhpcy53cmFwcGVyUmVhZHlTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBjaGFydFdyYXBwZXIoKTogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyIHtcclxuICAgIGlmICghdGhpcy53cmFwcGVyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyB0aGUgY2hhcnQgd3JhcHBlciBiZWZvcmUgaXQgd2FzIGZ1bGx5IGluaXRpYWxpemVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMud3JhcHBlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXQgY2hhcnRXcmFwcGVyKHdyYXBwZXI6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcikge1xyXG4gICAgdGhpcy53cmFwcGVyID0gd3JhcHBlcjtcclxuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmdPbkluaXQoKSB7XHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGxvYWQgYW55IGNoYXJ0IHBhY2thZ2VzLCB0aGUgY2hhcnQgd3JhcHBlciB3aWxsIGhhbmRsZSB0aGlzIGZvciB1c1xyXG4gICAgdGhpcy5zY3JpcHRMb2FkZXJTZXJ2aWNlLmxvYWRDaGFydFBhY2thZ2VzKGdldFBhY2thZ2VGb3JDaGFydCh0aGlzLnR5cGUpKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmRhdGFUYWJsZSA9IHRoaXMuZGF0YVRhYmxlU2VydmljZS5jcmVhdGUodGhpcy5kYXRhLCB0aGlzLmNvbHVtbnMsIHRoaXMuZm9ybWF0dGVycyk7XHJcblxyXG4gICAgICAvLyBPbmx5IGV2ZXIgY3JlYXRlIHRoZSB3cmFwcGVyIG9uY2UgdG8gYWxsb3cgYW5pbWF0aW9ucyB0byBoYXBwZW4gd2hlbiBzb21ldGhpbmcgY2hhbmdlcy5cclxuICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XHJcbiAgICAgICAgY29udGFpbmVyOiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcclxuICAgICAgICBjaGFydFR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICBkYXRhVGFibGU6IHRoaXMuZGF0YVRhYmxlLFxyXG4gICAgICAgIG9wdGlvbnM6IHRoaXMubWVyZ2VPcHRpb25zKClcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudHMoKTtcclxuXHJcbiAgICAgIHRoaXMud3JhcHBlclJlYWR5U3ViamVjdC5uZXh0KHRoaXMud3JhcHBlcik7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGlmIChjaGFuZ2VzLmR5bmFtaWNSZXNpemUpIHtcclxuICAgICAgdGhpcy51cGRhdGVSZXNpemVMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XHJcbiAgICAgIGxldCBzaG91bGRSZWRyYXcgPSBmYWxzZTtcclxuICAgICAgaWYgKGNoYW5nZXMuZGF0YSB8fCBjaGFuZ2VzLmNvbHVtbnMgfHwgY2hhbmdlcy5mb3JtYXR0ZXJzKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhVGFibGUgPSB0aGlzLmRhdGFUYWJsZVNlcnZpY2UuY3JlYXRlKHRoaXMuZGF0YSwgdGhpcy5jb2x1bW5zLCB0aGlzLmZvcm1hdHRlcnMpO1xyXG4gICAgICAgIHRoaXMud3JhcHBlciEuc2V0RGF0YVRhYmxlKHRoaXMuZGF0YVRhYmxlISk7XHJcbiAgICAgICAgc2hvdWxkUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNoYW5nZXMudHlwZSkge1xyXG4gICAgICAgIHRoaXMud3JhcHBlciEuc2V0Q2hhcnRUeXBlKHRoaXMudHlwZSk7XHJcbiAgICAgICAgc2hvdWxkUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNoYW5nZXMub3B0aW9ucyB8fCBjaGFuZ2VzLndpZHRoIHx8IGNoYW5nZXMuaGVpZ2h0IHx8IGNoYW5nZXMudGl0bGUpIHtcclxuICAgICAgICB0aGlzLndyYXBwZXIhLnNldE9wdGlvbnModGhpcy5tZXJnZU9wdGlvbnMoKSk7XHJcbiAgICAgICAgc2hvdWxkUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNob3VsZFJlZHJhdykge1xyXG4gICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmVUb1Jlc2l6ZUlmU3Vic2NyaWJlZCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRm9yIGxpc3RlbmluZyB0byBldmVudHMgb3RoZXIgdGhhbiB0aGUgbW9zdCBjb21tb24gb25lcyAoYXZhaWxhYmxlIHZpYSBPdXRwdXQgcHJvcGVydGllcykuXHJcbiAgICpcclxuICAgKiBDYW4gYmUgY2FsbGVkIGFmdGVyIHRoZSBjaGFydCBlbWl0cyB0aGF0IGl0J3MgXCJyZWFkeVwiLlxyXG4gICAqXHJcbiAgICogUmV0dXJucyBhIGhhbmRsZSB0aGF0IGNhbiBiZSB1c2VkIGZvciBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAuXHJcbiAgICovXHJcbiAgcHVibGljIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IGFueSB7XHJcbiAgICBjb25zdCBoYW5kbGUgPSB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLmNoYXJ0LCBldmVudE5hbWUsIGNhbGxiYWNrKTtcclxuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMuc2V0KGhhbmRsZSwgeyBldmVudE5hbWUsIGNhbGxiYWNrLCBoYW5kbGUgfSk7XHJcbiAgICByZXR1cm4gaGFuZGxlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlOiBhbnkpOiB2b2lkIHtcclxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5ldmVudExpc3RlbmVycy5nZXQoaGFuZGxlKTtcclxuICAgIGlmIChlbnRyeSkge1xyXG4gICAgICBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHMucmVtb3ZlTGlzdGVuZXIoZW50cnkuaGFuZGxlKTtcclxuICAgICAgdGhpcy5ldmVudExpc3RlbmVycy5kZWxldGUoaGFuZGxlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlUmVzaXplTGlzdGVuZXIoKSB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlVG9SZXNpemVJZlN1YnNjcmliZWQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5keW5hbWljUmVzaXplKSB7XHJcbiAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxyXG4gICAgICAgIC5waXBlKGRlYm91bmNlVGltZSgxMDApKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVUb1Jlc2l6ZUlmU3Vic2NyaWJlZCgpIHtcclxuICAgIGlmICh0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbiAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtZXJnZU9wdGlvbnMoKTogb2JqZWN0IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxyXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgLi4udGhpcy5vcHRpb25zXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWdpc3RlckNoYXJ0RXZlbnRzKCkge1xyXG4gICAgZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzLnJlbW92ZUFsbExpc3RlbmVycyh0aGlzLndyYXBwZXIpO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ3JlYWR5JywgKCkgPT4ge1xyXG4gICAgICAvLyBUaGlzIGNvdWxkIGFsc28gYmUgZG9uZSBieSBjaGVja2luZyBpZiB3ZSBhbHJlYWR5IHN1YnNjcmliZWQgdG8gdGhlIGV2ZW50c1xyXG4gICAgICBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHMucmVtb3ZlQWxsTGlzdGVuZXJzKHRoaXMuY2hhcnQpO1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLmNoYXJ0LCAnb25tb3VzZW92ZXInLCAoZXZlbnQ6IENoYXJ0TW91c2VPdmVyRXZlbnQpID0+IHRoaXMubW91c2VvdmVyLmVtaXQoZXZlbnQpKTtcclxuICAgICAgdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy5jaGFydCwgJ29ubW91c2VvdXQnLCAoZXZlbnQ6IENoYXJ0TW91c2VMZWF2ZUV2ZW50KSA9PiB0aGlzLm1vdXNlbGVhdmUuZW1pdChldmVudCkpO1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLmNoYXJ0LCAnc2VsZWN0JywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuY2hhcnQhLmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0LmVtaXQoeyBzZWxlY3Rpb24gfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLmZvckVhY2goeCA9PiAoeC5oYW5kbGUgPSB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLmNoYXJ0LCB4LmV2ZW50TmFtZSwgeC5jYWxsYmFjaykpKTtcclxuXHJcbiAgICAgIHRoaXMucmVhZHkuZW1pdCh7IGNoYXJ0OiB0aGlzLmNoYXJ0ISB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ2Vycm9yJywgKGVycm9yOiBDaGFydEVycm9yRXZlbnQpID0+IHRoaXMuZXJyb3IuZW1pdChlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWdpc3RlckNoYXJ0RXZlbnQob2JqZWN0OiBhbnksIGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiBhbnkge1xyXG4gICAgcmV0dXJuIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5hZGRMaXN0ZW5lcihvYmplY3QsIGV2ZW50TmFtZSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkcmF3Q2hhcnQoKSB7XHJcbiAgICBpZiAodGhpcy5kYXNoYm9hcmQgIT0gbnVsbCkge1xyXG4gICAgICAvLyBJZiB0aGlzIGNoYXJ0IGlzIHBhcnQgb2YgYSBkYXNoYm9hcmQsIHRoZSBkYXNoYm9hcmQgdGFrZXMgY2FyZSBvZiBkcmF3aW5nXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLndyYXBwZXIhLmRyYXcoKTtcclxuICB9XHJcbn1cclxuIl19