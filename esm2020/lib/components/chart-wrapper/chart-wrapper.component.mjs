import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ScriptLoaderService } from '../../services/script-loader.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/script-loader.service";
export class ChartWrapperComponent {
    constructor(element, scriptLoaderService) {
        this.element = element;
        this.scriptLoaderService = scriptLoaderService;
        this.error = new EventEmitter();
        this.ready = new EventEmitter();
        this.select = new EventEmitter();
        this.wrapperReadySubject = new ReplaySubject(1);
        this.initialized = false;
    }
    get chart() {
        return this.chartWrapper.getChart();
    }
    get wrapperReady$() {
        return this.wrapperReadySubject.asObservable();
    }
    get chartWrapper() {
        if (!this.wrapper) {
            throw new Error('Cannot access the chart wrapper before initialization.');
        }
        return this.wrapper;
    }
    set chartWrapper(wrapper) {
        this.wrapper = wrapper;
        this.drawChart();
    }
    ngOnInit() {
        // We don't need to load any chart packages, the chart wrapper will handle this else for us
        this.scriptLoaderService.loadChartPackages().subscribe(() => {
            if (!this.specs) {
                this.specs = {};
            }
            const { containerId, container, ...specs } = this.specs;
            // Only ever create the wrapper once to allow animations to happen if something changes.
            this.wrapper = new google.visualization.ChartWrapper({
                ...specs,
                container: this.element.nativeElement
            });
            this.registerChartEvents();
            this.wrapperReadySubject.next(this.wrapper);
            this.drawChart();
            this.initialized = true;
        });
    }
    ngOnChanges(changes) {
        if (!this.initialized) {
            return;
        }
        if (changes.specs) {
            this.updateChart();
            this.drawChart();
        }
    }
    updateChart() {
        if (!this.specs) {
            // When creating the wrapper with empty specs, the google charts library will show an error
            // If we don't do this, a javascript error will be thrown, which is not as visible to the user
            this.specs = {};
        }
        // The typing here are not correct. These methods accept `undefined` as well.
        // That's why we have to cast to `any`
        this.wrapper.setChartType(this.specs.chartType);
        this.wrapper.setDataTable(this.specs.dataTable);
        this.wrapper.setDataSourceUrl(this.specs.dataSourceUrl);
        this.wrapper.setDataSourceUrl(this.specs.dataSourceUrl);
        this.wrapper.setQuery(this.specs.query);
        this.wrapper.setOptions(this.specs.options);
        this.wrapper.setRefreshInterval(this.specs.refreshInterval);
        this.wrapper.setView(this.specs.view);
    }
    drawChart() {
        if (this.wrapper) {
            this.wrapper.draw();
        }
    }
    registerChartEvents() {
        google.visualization.events.removeAllListeners(this.wrapper);
        const registerChartEvent = (object, eventName, callback) => {
            google.visualization.events.addListener(object, eventName, callback);
        };
        registerChartEvent(this.wrapper, 'ready', () => this.ready.emit({ chart: this.chart }));
        registerChartEvent(this.wrapper, 'error', (error) => this.error.emit(error));
        registerChartEvent(this.wrapper, 'select', () => {
            const selection = this.chart.getSelection();
            this.select.emit({ selection });
        });
    }
}
ChartWrapperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChartWrapperComponent, deps: [{ token: i0.ElementRef }, { token: i1.ScriptLoaderService }], target: i0.ɵɵFactoryTarget.Component });
ChartWrapperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: ChartWrapperComponent, selector: "chart-wrapper", inputs: { specs: "specs" }, outputs: { error: "error", ready: "ready", select: "select" }, host: { classAttribute: "chart-wrapper" }, exportAs: ["chartWrapper"], usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChartWrapperComponent, decorators: [{
            type: Component,
            args: [{ selector: 'chart-wrapper', template: '', host: { class: 'chart-wrapper' }, exportAs: 'chartWrapper', changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ScriptLoaderService }]; }, propDecorators: { specs: [{
                type: Input
            }], error: [{
                type: Output
            }], ready: [{
                type: Output
            }], select: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtd3JhcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9saWJzL2FuZ3VsYXItZ29vZ2xlLWNoYXJ0cy9zcmMvbGliL2NvbXBvbmVudHMvY2hhcnQtd3JhcHBlci9jaGFydC13cmFwcGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVyQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7O0FBWTNFLE1BQU0sT0FBTyxxQkFBcUI7SUF5QmhDLFlBQW9CLE9BQW1CLEVBQVUsbUJBQXdDO1FBQXJFLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBWmxGLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQUc1QyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFHNUMsV0FBTSxHQUFHLElBQUksWUFBWSxFQUE4QixDQUFDO1FBR3ZELHdCQUFtQixHQUFHLElBQUksYUFBYSxDQUFvQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxnQkFBVyxHQUFHLEtBQUssQ0FBQztJQUVnRSxDQUFDO0lBRTdGLElBQVcsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBVyxhQUFhO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFRCxJQUFXLFlBQVk7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO1NBQzNFO1FBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFXLFlBQVksQ0FBQyxPQUEwQztRQUNoRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVNLFFBQVE7UUFDYiwyRkFBMkY7UUFDM0YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQXFDLENBQUM7YUFDcEQ7WUFFRCxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxHQUFHLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFFeEQsd0ZBQXdGO1lBQ3hGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztnQkFDbkQsR0FBRyxLQUFLO2dCQUNSLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7YUFDdEMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFFM0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFNUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFdBQVcsQ0FBQyxPQUFzQjtRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNyQixPQUFPO1NBQ1I7UUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDakIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFTyxXQUFXO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsMkZBQTJGO1lBQzNGLDhGQUE4RjtZQUM5RixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQXFDLENBQUM7U0FDcEQ7UUFFRCw2RUFBNkU7UUFDN0Usc0NBQXNDO1FBRXRDLElBQUksQ0FBQyxPQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE9BQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFnQixDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQW9CLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsT0FBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBb0IsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxPQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBWSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE9BQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFjLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsT0FBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBc0IsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxPQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVPLFNBQVM7UUFDZixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFTyxtQkFBbUI7UUFDekIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTdELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxNQUFXLEVBQUUsU0FBaUIsRUFBRSxRQUFrQixFQUFFLEVBQUU7WUFDaEYsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDO1FBRUYsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQXNCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDOUYsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQzlDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7a0hBekhVLHFCQUFxQjtzR0FBckIscUJBQXFCLDRPQU50QixFQUFFOzJGQU1ELHFCQUFxQjtrQkFSakMsU0FBUzsrQkFDRSxlQUFlLFlBQ2YsRUFBRSxRQUVOLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxZQUN0QixjQUFjLG1CQUNQLHVCQUF1QixDQUFDLE1BQU07bUlBWXhDLEtBQUs7c0JBRFgsS0FBSztnQkFJQyxLQUFLO3NCQURYLE1BQU07Z0JBSUEsS0FBSztzQkFEWCxNQUFNO2dCQUlBLE1BQU07c0JBRFosTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIElucHV0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFNpbXBsZUNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgU2NyaXB0TG9hZGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NjcmlwdC1sb2FkZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENoYXJ0RXJyb3JFdmVudCwgQ2hhcnRSZWFkeUV2ZW50LCBDaGFydFNlbGVjdGlvbkNoYW5nZWRFdmVudCB9IGZyb20gJy4uLy4uL3R5cGVzL2V2ZW50cyc7XHJcbmltcG9ydCB7IENoYXJ0QmFzZSB9IGZyb20gJy4uL2NoYXJ0LWJhc2UvY2hhcnQtYmFzZS5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdjaGFydC13cmFwcGVyJyxcclxuICB0ZW1wbGF0ZTogJycsXHJcbiAgc3R5bGVzOiBbJzpob3N0IHsgd2lkdGg6IGZpdC1jb250ZW50OyBkaXNwbGF5OiBibG9jazsgfSddLFxyXG4gIGhvc3Q6IHsgY2xhc3M6ICdjaGFydC13cmFwcGVyJyB9LFxyXG4gIGV4cG9ydEFzOiAnY2hhcnRXcmFwcGVyJyxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2hhcnRXcmFwcGVyQ29tcG9uZW50IGltcGxlbWVudHMgQ2hhcnRCYXNlLCBPbkNoYW5nZXMsIE9uSW5pdCB7XHJcbiAgLyoqXHJcbiAgICogRWl0aGVyIGEgSlNPTiBvYmplY3QgZGVmaW5pbmcgdGhlIGNoYXJ0LCBvciBhIHNlcmlhbGl6ZWQgc3RyaW5nIHZlcnNpb24gb2YgdGhhdCBvYmplY3QuXHJcbiAgICogVGhlIGZvcm1hdCBvZiB0aGlzIG9iamVjdCBpcyBzaG93biBpbiB0aGVcclxuICAgKiB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vY2hhcnQvaW50ZXJhY3RpdmUvZG9jcy9yZWZlcmVuY2UjZ29vZ2xlLnZpc3VhbGl6YXRpb24uZHJhd2NoYXJ0IGBkcmF3Q2hhcnQoKWB9IGRvY3VtZW50YXRpb24uXHJcbiAgICpcclxuICAgKiBUaGUgYGNvbnRhaW5lcmAgYW5kIGBjb250YWluZXJJZGAgd2lsbCBiZSBvdmVyd3JpdHRlbiBieSB0aGlzIGNvbXBvbmVudCB0byBhbGxvd1xyXG4gICAqIHJlbmRlcmluZyB0aGUgY2hhcnQgaW50byB0aGUgY29tcG9uZW50cycgdGVtcGxhdGUuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBwdWJsaWMgc3BlY3M/OiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFNwZWNzO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIHJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydFJlYWR5RXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHB1YmxpYyBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0U2VsZWN0aW9uQ2hhbmdlZEV2ZW50PigpO1xyXG5cclxuICBwcml2YXRlIHdyYXBwZXI6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlciB8IHVuZGVmaW5lZDtcclxuICBwcml2YXRlIHdyYXBwZXJSZWFkeVN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXI+KDEpO1xyXG4gIHByaXZhdGUgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIHNjcmlwdExvYWRlclNlcnZpY2U6IFNjcmlwdExvYWRlclNlcnZpY2UpIHt9XHJcblxyXG4gIHB1YmxpYyBnZXQgY2hhcnQoKTogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRCYXNlIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGFydFdyYXBwZXIuZ2V0Q2hhcnQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgd3JhcHBlclJlYWR5JCgpIHtcclxuICAgIHJldHVybiB0aGlzLndyYXBwZXJSZWFkeVN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IGNoYXJ0V3JhcHBlcigpOiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIge1xyXG4gICAgaWYgKCF0aGlzLndyYXBwZXIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWNjZXNzIHRoZSBjaGFydCB3cmFwcGVyIGJlZm9yZSBpbml0aWFsaXphdGlvbi4nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy53cmFwcGVyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldCBjaGFydFdyYXBwZXIod3JhcHBlcjogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKSB7XHJcbiAgICB0aGlzLndyYXBwZXIgPSB3cmFwcGVyO1xyXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcclxuICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gbG9hZCBhbnkgY2hhcnQgcGFja2FnZXMsIHRoZSBjaGFydCB3cmFwcGVyIHdpbGwgaGFuZGxlIHRoaXMgZWxzZSBmb3IgdXNcclxuICAgIHRoaXMuc2NyaXB0TG9hZGVyU2VydmljZS5sb2FkQ2hhcnRQYWNrYWdlcygpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5zcGVjcykge1xyXG4gICAgICAgIHRoaXMuc3BlY3MgPSB7fSBhcyBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFNwZWNzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB7IGNvbnRhaW5lcklkLCBjb250YWluZXIsIC4uLnNwZWNzIH0gPSB0aGlzLnNwZWNzO1xyXG5cclxuICAgICAgLy8gT25seSBldmVyIGNyZWF0ZSB0aGUgd3JhcHBlciBvbmNlIHRvIGFsbG93IGFuaW1hdGlvbnMgdG8gaGFwcGVuIGlmIHNvbWV0aGluZyBjaGFuZ2VzLlxyXG4gICAgICB0aGlzLndyYXBwZXIgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKHtcclxuICAgICAgICAuLi5zcGVjcyxcclxuICAgICAgICBjb250YWluZXI6IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudHMoKTtcclxuXHJcbiAgICAgIHRoaXMud3JhcHBlclJlYWR5U3ViamVjdC5uZXh0KHRoaXMud3JhcHBlcik7XHJcblxyXG4gICAgICB0aGlzLmRyYXdDaGFydCgpO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXMuc3BlY3MpIHtcclxuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xyXG4gICAgICB0aGlzLmRyYXdDaGFydCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVDaGFydCgpIHtcclxuICAgIGlmICghdGhpcy5zcGVjcykge1xyXG4gICAgICAvLyBXaGVuIGNyZWF0aW5nIHRoZSB3cmFwcGVyIHdpdGggZW1wdHkgc3BlY3MsIHRoZSBnb29nbGUgY2hhcnRzIGxpYnJhcnkgd2lsbCBzaG93IGFuIGVycm9yXHJcbiAgICAgIC8vIElmIHdlIGRvbid0IGRvIHRoaXMsIGEgamF2YXNjcmlwdCBlcnJvciB3aWxsIGJlIHRocm93biwgd2hpY2ggaXMgbm90IGFzIHZpc2libGUgdG8gdGhlIHVzZXJcclxuICAgICAgdGhpcy5zcGVjcyA9IHt9IGFzIGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0U3BlY3M7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhlIHR5cGluZyBoZXJlIGFyZSBub3QgY29ycmVjdC4gVGhlc2UgbWV0aG9kcyBhY2NlcHQgYHVuZGVmaW5lZGAgYXMgd2VsbC5cclxuICAgIC8vIFRoYXQncyB3aHkgd2UgaGF2ZSB0byBjYXN0IHRvIGBhbnlgXHJcblxyXG4gICAgdGhpcy53cmFwcGVyIS5zZXRDaGFydFR5cGUodGhpcy5zcGVjcy5jaGFydFR5cGUpO1xyXG4gICAgdGhpcy53cmFwcGVyIS5zZXREYXRhVGFibGUodGhpcy5zcGVjcy5kYXRhVGFibGUgYXMgYW55KTtcclxuICAgIHRoaXMud3JhcHBlciEuc2V0RGF0YVNvdXJjZVVybCh0aGlzLnNwZWNzLmRhdGFTb3VyY2VVcmwgYXMgYW55KTtcclxuICAgIHRoaXMud3JhcHBlciEuc2V0RGF0YVNvdXJjZVVybCh0aGlzLnNwZWNzLmRhdGFTb3VyY2VVcmwgYXMgYW55KTtcclxuICAgIHRoaXMud3JhcHBlciEuc2V0UXVlcnkodGhpcy5zcGVjcy5xdWVyeSBhcyBhbnkpO1xyXG4gICAgdGhpcy53cmFwcGVyIS5zZXRPcHRpb25zKHRoaXMuc3BlY3Mub3B0aW9ucyBhcyBhbnkpO1xyXG4gICAgdGhpcy53cmFwcGVyIS5zZXRSZWZyZXNoSW50ZXJ2YWwodGhpcy5zcGVjcy5yZWZyZXNoSW50ZXJ2YWwgYXMgYW55KTtcclxuICAgIHRoaXMud3JhcHBlciEuc2V0Vmlldyh0aGlzLnNwZWNzLnZpZXcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkcmF3Q2hhcnQoKSB7XHJcbiAgICBpZiAodGhpcy53cmFwcGVyKSB7XHJcbiAgICAgIHRoaXMud3JhcHBlci5kcmF3KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZ2lzdGVyQ2hhcnRFdmVudHMoKSB7XHJcbiAgICBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHMucmVtb3ZlQWxsTGlzdGVuZXJzKHRoaXMud3JhcHBlcik7XHJcblxyXG4gICAgY29uc3QgcmVnaXN0ZXJDaGFydEV2ZW50ID0gKG9iamVjdDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSA9PiB7XHJcbiAgICAgIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5hZGRMaXN0ZW5lcihvYmplY3QsIGV2ZW50TmFtZSwgY2FsbGJhY2spO1xyXG4gICAgfTtcclxuXHJcbiAgICByZWdpc3RlckNoYXJ0RXZlbnQodGhpcy53cmFwcGVyLCAncmVhZHknLCAoKSA9PiB0aGlzLnJlYWR5LmVtaXQoeyBjaGFydDogdGhpcy5jaGFydCEgfSkpO1xyXG4gICAgcmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ2Vycm9yJywgKGVycm9yOiBDaGFydEVycm9yRXZlbnQpID0+IHRoaXMuZXJyb3IuZW1pdChlcnJvcikpO1xyXG4gICAgcmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ3NlbGVjdCcsICgpID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5jaGFydCEuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICAgIHRoaXMuc2VsZWN0LmVtaXQoeyBzZWxlY3Rpb24gfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19