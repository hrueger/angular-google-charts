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
ChartWrapperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: ChartWrapperComponent, deps: [{ token: i0.ElementRef }, { token: i1.ScriptLoaderService }], target: i0.ɵɵFactoryTarget.Component });
ChartWrapperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: ChartWrapperComponent, selector: "chart-wrapper", inputs: { specs: "specs" }, outputs: { error: "error", ready: "ready", select: "select" }, host: { classAttribute: "chart-wrapper" }, exportAs: ["chartWrapper"], usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: ChartWrapperComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'chart-wrapper',
                    template: '',
                    styles: [':host { width: fit-content; display: block; }'],
                    host: { class: 'chart-wrapper' },
                    exportAs: 'chartWrapper',
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ScriptLoaderService }]; }, propDecorators: { specs: [{
                type: Input
            }], error: [{
                type: Output
            }], ready: [{
                type: Output
            }], select: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtd3JhcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9saWJzL2FuZ3VsYXItZ29vZ2xlLWNoYXJ0cy9zcmMvbGliL2NvbXBvbmVudHMvY2hhcnQtd3JhcHBlci9jaGFydC13cmFwcGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVyQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7O0FBWTNFLE1BQU0sT0FBTyxxQkFBcUI7SUF5QmhDLFlBQW9CLE9BQW1CLEVBQVUsbUJBQXdDO1FBQXJFLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBWmxGLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQUc1QyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFHNUMsV0FBTSxHQUFHLElBQUksWUFBWSxFQUE4QixDQUFDO1FBR3ZELHdCQUFtQixHQUFHLElBQUksYUFBYSxDQUFvQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxnQkFBVyxHQUFHLEtBQUssQ0FBQztJQUVnRSxDQUFDO0lBRTdGLElBQVcsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBVyxhQUFhO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFRCxJQUFXLFlBQVk7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIs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RSxjQUFjO29CQUN4QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7bUlBV1EsS0FBSztzQkFEWCxLQUFLO2dCQUlDLEtBQUs7c0JBRFgsTUFBTTtnQkFJQSxLQUFLO3NCQURYLE1BQU07Z0JBSUEsTUFBTTtzQkFEWixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgU2NyaXB0TG9hZGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NjcmlwdC1sb2FkZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDaGFydEVycm9yRXZlbnQsIENoYXJ0UmVhZHlFdmVudCwgQ2hhcnRTZWxlY3Rpb25DaGFuZ2VkRXZlbnQgfSBmcm9tICcuLi8uLi90eXBlcy9ldmVudHMnO1xuaW1wb3J0IHsgQ2hhcnRCYXNlIH0gZnJvbSAnLi4vY2hhcnQtYmFzZS9jaGFydC1iYXNlLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NoYXJ0LXdyYXBwZXInLFxuICB0ZW1wbGF0ZTogJycsXG4gIHN0eWxlczogWyc6aG9zdCB7IHdpZHRoOiBmaXQtY29udGVudDsgZGlzcGxheTogYmxvY2s7IH0nXSxcbiAgaG9zdDogeyBjbGFzczogJ2NoYXJ0LXdyYXBwZXInIH0sXG4gIGV4cG9ydEFzOiAnY2hhcnRXcmFwcGVyJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgQ2hhcnRXcmFwcGVyQ29tcG9uZW50IGltcGxlbWVudHMgQ2hhcnRCYXNlLCBPbkNoYW5nZXMsIE9uSW5pdCB7XG4gIC8qKlxuICAgKiBFaXRoZXIgYSBKU09OIG9iamVjdCBkZWZpbmluZyB0aGUgY2hhcnQsIG9yIGEgc2VyaWFsaXplZCBzdHJpbmcgdmVyc2lvbiBvZiB0aGF0IG9iamVjdC5cbiAgICogVGhlIGZvcm1hdCBvZiB0aGlzIG9iamVjdCBpcyBzaG93biBpbiB0aGVcbiAgICoge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2NoYXJ0L2ludGVyYWN0aXZlL2RvY3MvcmVmZXJlbmNlI2dvb2dsZS52aXN1YWxpemF0aW9uLmRyYXdjaGFydCBgZHJhd0NoYXJ0KClgfSBkb2N1bWVudGF0aW9uLlxuICAgKlxuICAgKiBUaGUgYGNvbnRhaW5lcmAgYW5kIGBjb250YWluZXJJZGAgd2lsbCBiZSBvdmVyd3JpdHRlbiBieSB0aGlzIGNvbXBvbmVudCB0byBhbGxvd1xuICAgKiByZW5kZXJpbmcgdGhlIGNoYXJ0IGludG8gdGhlIGNvbXBvbmVudHMnIHRlbXBsYXRlLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIHNwZWNzPzogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRTcGVjcztcblxuICBAT3V0cHV0KClcbiAgcHVibGljIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEVycm9yRXZlbnQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyByZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRSZWFkeUV2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydFNlbGVjdGlvbkNoYW5nZWRFdmVudD4oKTtcblxuICBwcml2YXRlIHdyYXBwZXI6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlciB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSB3cmFwcGVyUmVhZHlTdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8Z29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyPigxKTtcbiAgcHJpdmF0ZSBpbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBzY3JpcHRMb2FkZXJTZXJ2aWNlOiBTY3JpcHRMb2FkZXJTZXJ2aWNlKSB7fVxuXG4gIHB1YmxpYyBnZXQgY2hhcnQoKTogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRCYXNlIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuY2hhcnRXcmFwcGVyLmdldENoYXJ0KCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHdyYXBwZXJSZWFkeSQoKSB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlclJlYWR5U3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgY2hhcnRXcmFwcGVyKCk6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlciB7XG4gICAgaWYgKCF0aGlzLndyYXBwZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFjY2VzcyB0aGUgY2hhcnQgd3JhcHBlciBiZWZvcmUgaW5pdGlhbGl6YXRpb24uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMud3JhcHBlcjtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgY2hhcnRXcmFwcGVyKHdyYXBwZXI6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcikge1xuICAgIHRoaXMud3JhcHBlciA9IHdyYXBwZXI7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGxvYWQgYW55IGNoYXJ0IHBhY2thZ2VzLCB0aGUgY2hhcnQgd3JhcHBlciB3aWxsIGhhbmRsZSB0aGlzIGVsc2UgZm9yIHVzXG4gICAgdGhpcy5zY3JpcHRMb2FkZXJTZXJ2aWNlLmxvYWRDaGFydFBhY2thZ2VzKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zcGVjcykge1xuICAgICAgICB0aGlzLnNwZWNzID0ge30gYXMgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRTcGVjcztcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBjb250YWluZXJJZCwgY29udGFpbmVyLCAuLi5zcGVjcyB9ID0gdGhpcy5zcGVjcztcblxuICAgICAgLy8gT25seSBldmVyIGNyZWF0ZSB0aGUgd3JhcHBlciBvbmNlIHRvIGFsbG93IGFuaW1hdGlvbnMgdG8gaGFwcGVuIGlmIHNvbWV0aGluZyBjaGFuZ2VzLlxuICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgICAgIC4uLnNwZWNzLFxuICAgICAgICBjb250YWluZXI6IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50XG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50cygpO1xuXG4gICAgICB0aGlzLndyYXBwZXJSZWFkeVN1YmplY3QubmV4dCh0aGlzLndyYXBwZXIpO1xuXG4gICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLnNwZWNzKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQ2hhcnQoKSB7XG4gICAgaWYgKCF0aGlzLnNwZWNzKSB7XG4gICAgICAvLyBXaGVuIGNyZWF0aW5nIHRoZSB3cmFwcGVyIHdpdGggZW1wdHkgc3BlY3MsIHRoZSBnb29nbGUgY2hhcnRzIGxpYnJhcnkgd2lsbCBzaG93IGFuIGVycm9yXG4gICAgICAvLyBJZiB3ZSBkb24ndCBkbyB0aGlzLCBhIGphdmFzY3JpcHQgZXJyb3Igd2lsbCBiZSB0aHJvd24sIHdoaWNoIGlzIG5vdCBhcyB2aXNpYmxlIHRvIHRoZSB1c2VyXG4gICAgICB0aGlzLnNwZWNzID0ge30gYXMgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRTcGVjcztcbiAgICB9XG5cbiAgICAvLyBUaGUgdHlwaW5nIGhlcmUgYXJlIG5vdCBjb3JyZWN0LiBUaGVzZSBtZXRob2RzIGFjY2VwdCBgdW5kZWZpbmVkYCBhcyB3ZWxsLlxuICAgIC8vIFRoYXQncyB3aHkgd2UgaGF2ZSB0byBjYXN0IHRvIGBhbnlgXG5cbiAgICB0aGlzLndyYXBwZXIhLnNldENoYXJ0VHlwZSh0aGlzLnNwZWNzLmNoYXJ0VHlwZSk7XG4gICAgdGhpcy53cmFwcGVyIS5zZXREYXRhVGFibGUodGhpcy5zcGVjcy5kYXRhVGFibGUgYXMgYW55KTtcbiAgICB0aGlzLndyYXBwZXIhLnNldERhdGFTb3VyY2VVcmwodGhpcy5zcGVjcy5kYXRhU291cmNlVXJsIGFzIGFueSk7XG4gICAgdGhpcy53cmFwcGVyIS5zZXREYXRhU291cmNlVXJsKHRoaXMuc3BlY3MuZGF0YVNvdXJjZVVybCBhcyBhbnkpO1xuICAgIHRoaXMud3JhcHBlciEuc2V0UXVlcnkodGhpcy5zcGVjcy5xdWVyeSBhcyBhbnkpO1xuICAgIHRoaXMud3JhcHBlciEuc2V0T3B0aW9ucyh0aGlzLnNwZWNzLm9wdGlvbnMgYXMgYW55KTtcbiAgICB0aGlzLndyYXBwZXIhLnNldFJlZnJlc2hJbnRlcnZhbCh0aGlzLnNwZWNzLnJlZnJlc2hJbnRlcnZhbCBhcyBhbnkpO1xuICAgIHRoaXMud3JhcHBlciEuc2V0Vmlldyh0aGlzLnNwZWNzLnZpZXcpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3Q2hhcnQoKSB7XG4gICAgaWYgKHRoaXMud3JhcHBlcikge1xuICAgICAgdGhpcy53cmFwcGVyLmRyYXcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyQ2hhcnRFdmVudHMoKSB7XG4gICAgZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzLnJlbW92ZUFsbExpc3RlbmVycyh0aGlzLndyYXBwZXIpO1xuXG4gICAgY29uc3QgcmVnaXN0ZXJDaGFydEV2ZW50ID0gKG9iamVjdDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSA9PiB7XG4gICAgICBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHMuYWRkTGlzdGVuZXIob2JqZWN0LCBldmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgcmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ3JlYWR5JywgKCkgPT4gdGhpcy5yZWFkeS5lbWl0KHsgY2hhcnQ6IHRoaXMuY2hhcnQhIH0pKTtcbiAgICByZWdpc3RlckNoYXJ0RXZlbnQodGhpcy53cmFwcGVyLCAnZXJyb3InLCAoZXJyb3I6IENoYXJ0RXJyb3JFdmVudCkgPT4gdGhpcy5lcnJvci5lbWl0KGVycm9yKSk7XG4gICAgcmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ3NlbGVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuY2hhcnQhLmdldFNlbGVjdGlvbigpO1xuICAgICAgdGhpcy5zZWxlY3QuZW1pdCh7IHNlbGVjdGlvbiB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19