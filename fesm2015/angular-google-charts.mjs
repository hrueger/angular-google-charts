import * as i1 from 'rxjs';
import { Subject, of, Observable, ReplaySubject, combineLatest, fromEvent } from 'rxjs';
import * as i0 from '@angular/core';
import { InjectionToken, inject, InjectFlags, LOCALE_ID, Injectable, Inject, Component, ChangeDetectionStrategy, EventEmitter, Input, Output, HostBinding, ContentChildren, Optional, NgModule } from '@angular/core';
import { mergeMap, map, switchMap, debounceTime } from 'rxjs/operators';
import { __rest } from 'tslib';

/// <reference path="./types.ts" />
class ChartEditorRef {
    constructor(editor) {
        this.editor = editor;
        this.doneSubject = new Subject();
        this.addEventListeners();
    }
    /**
     * Gets an observable that is notified when the dialog is saved.
     * Emits either the result if the dialog was saved or `null` if editing was cancelled.
     */
    afterClosed() {
        return this.doneSubject.asObservable();
    }
    /**
     * Stops editing the chart and closes the dialog.
     */
    cancel() {
        this.editor.closeDialog();
    }
    addEventListeners() {
        google.visualization.events.addOneTimeListener(this.editor, 'ok', () => {
            google.visualization.events.removeAllListeners(this.editor);
            const updatedChartWrapper = this.editor.getChartWrapper();
            this.doneSubject.next(updatedChartWrapper);
            this.doneSubject.complete();
        });
        google.visualization.events.addOneTimeListener(this.editor, 'cancel', () => {
            google.visualization.events.removeAllListeners(this.editor);
            this.doneSubject.next(null);
            this.doneSubject.complete();
        });
    }
}

var ChartType;
(function (ChartType) {
    ChartType["AnnotationChart"] = "AnnotationChart";
    ChartType["AreaChart"] = "AreaChart";
    ChartType["Bar"] = "Bar";
    ChartType["BarChart"] = "BarChart";
    ChartType["BubbleChart"] = "BubbleChart";
    ChartType["Calendar"] = "Calendar";
    ChartType["CandlestickChart"] = "CandlestickChart";
    ChartType["ColumnChart"] = "ColumnChart";
    ChartType["ComboChart"] = "ComboChart";
    ChartType["PieChart"] = "PieChart";
    ChartType["Gantt"] = "Gantt";
    ChartType["Gauge"] = "Gauge";
    ChartType["GeoChart"] = "GeoChart";
    ChartType["Histogram"] = "Histogram";
    ChartType["Line"] = "Line";
    ChartType["LineChart"] = "LineChart";
    ChartType["Map"] = "Map";
    ChartType["OrgChart"] = "OrgChart";
    ChartType["Sankey"] = "Sankey";
    ChartType["Scatter"] = "Scatter";
    ChartType["ScatterChart"] = "ScatterChart";
    ChartType["SteppedAreaChart"] = "SteppedAreaChart";
    ChartType["Table"] = "Table";
    ChartType["Timeline"] = "Timeline";
    ChartType["TreeMap"] = "TreeMap";
    ChartType["WordTree"] = "wordtree";
})(ChartType || (ChartType = {}));

const ChartTypesToPackages = {
    [ChartType.AnnotationChart]: 'annotationchart',
    [ChartType.AreaChart]: 'corechart',
    [ChartType.Bar]: 'bar',
    [ChartType.BarChart]: 'corechart',
    [ChartType.BubbleChart]: 'corechart',
    [ChartType.Calendar]: 'calendar',
    [ChartType.CandlestickChart]: 'corechart',
    [ChartType.ColumnChart]: 'corechart',
    [ChartType.ComboChart]: 'corechart',
    [ChartType.PieChart]: 'corechart',
    [ChartType.Gantt]: 'gantt',
    [ChartType.Gauge]: 'gauge',
    [ChartType.GeoChart]: 'geochart',
    [ChartType.Histogram]: 'corechart',
    [ChartType.Line]: 'line',
    [ChartType.LineChart]: 'corechart',
    [ChartType.Map]: 'map',
    [ChartType.OrgChart]: 'orgchart',
    [ChartType.Sankey]: 'sankey',
    [ChartType.Scatter]: 'scatter',
    [ChartType.ScatterChart]: 'corechart',
    [ChartType.SteppedAreaChart]: 'corechart',
    [ChartType.Table]: 'table',
    [ChartType.Timeline]: 'timeline',
    [ChartType.TreeMap]: 'treemap',
    [ChartType.WordTree]: 'wordtree'
};
function getPackageForChart(type) {
    return ChartTypesToPackages[type];
}
function getDefaultConfig() {
    return {
        version: 'current',
        safeMode: false
    };
}

const GOOGLE_CHARTS_CONFIG = new InjectionToken('GOOGLE_CHARTS_CONFIG');
const GOOGLE_CHARTS_LAZY_CONFIG = new InjectionToken('GOOGLE_CHARTS_LAZY_CONFIG', {
    providedIn: 'root',
    factory: () => {
        const configFromModule = inject(GOOGLE_CHARTS_CONFIG, InjectFlags.Optional);
        return of(Object.assign(Object.assign({}, getDefaultConfig()), (configFromModule || {})));
    }
});

class ScriptLoaderService {
    constructor(zone, localeId, config$) {
        this.zone = zone;
        this.localeId = localeId;
        this.config$ = config$;
        this.scriptSource = 'https://www.gstatic.com/charts/loader.js';
        this.scriptLoadSubject = new Subject();
    }
    /**
     * Checks whether `google.charts` is available.
     *
     * If not, it can be loaded by calling `loadChartPackages`.
     *
     * @returns `true` if `google.charts` is available, `false` otherwise.
     */
    isGoogleChartsAvailable() {
        if (typeof google === 'undefined' || typeof google.charts === 'undefined') {
            return false;
        }
        return true;
    }
    /**
     * Loads the Google Chart script and the provided chart packages.
     * Can be called multiple times to load more packages.
     *
     * When called without any arguments, this will just load the default package
     * containing the namespaces `google.charts` and `google.visualization` without any charts.
     *
     * @param packages The packages to load.
     * @returns A stream emitting as soon as the chart packages are loaded.
     */
    loadChartPackages(...packages) {
        return this.loadGoogleCharts().pipe(mergeMap(() => this.config$), map(config => {
            return Object.assign(Object.assign({}, getDefaultConfig()), (config || {}));
        }), switchMap((googleChartsConfig) => {
            return new Observable(observer => {
                const config = {
                    packages,
                    language: this.localeId,
                    mapsApiKey: googleChartsConfig.mapsApiKey,
                    safeMode: googleChartsConfig.safeMode
                };
                google.charts.load(googleChartsConfig.version, config);
                google.charts.setOnLoadCallback(() => {
                    this.zone.run(() => {
                        observer.next();
                        observer.complete();
                    });
                });
            });
        }));
    }
    /**
     * Loads the Google Charts script. After the script is loaded, `google.charts` is defined.
     *
     * @returns A stream emitting as soon as loading has completed.
     * If the google charts script is already loaded, the stream emits immediately.
     */
    loadGoogleCharts() {
        if (this.isGoogleChartsAvailable()) {
            return of(undefined);
        }
        else if (!this.isLoadingGoogleCharts()) {
            const script = this.createGoogleChartsScript();
            script.onload = () => {
                this.zone.run(() => {
                    this.scriptLoadSubject.next();
                    this.scriptLoadSubject.complete();
                });
            };
            script.onerror = () => {
                this.zone.run(() => {
                    console.error('Failed to load the google charts script!');
                    this.scriptLoadSubject.error(new Error('Failed to load the google charts script!'));
                });
            };
        }
        return this.scriptLoadSubject.asObservable();
    }
    isLoadingGoogleCharts() {
        return this.getGoogleChartsScript() != null;
    }
    getGoogleChartsScript() {
        const pageScripts = Array.from(document.getElementsByTagName('script'));
        return pageScripts.find(script => script.src === this.scriptSource);
    }
    createGoogleChartsScript() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scriptSource;
        script.async = true;
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;
    }
}
ScriptLoaderService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ScriptLoaderService, deps: [{ token: i0.NgZone }, { token: LOCALE_ID }, { token: GOOGLE_CHARTS_LAZY_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
ScriptLoaderService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ScriptLoaderService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ScriptLoaderService, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i0.NgZone }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [LOCALE_ID]
                    }] }, { type: i1.Observable, decorators: [{
                        type: Inject,
                        args: [GOOGLE_CHARTS_LAZY_CONFIG]
                    }] }];
    } });

/// <reference path="./types.ts" />
class ChartEditorComponent {
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
ChartEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChartEditorComponent, deps: [{ token: ScriptLoaderService }], target: i0.ɵɵFactoryTarget.Component });
ChartEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: ChartEditorComponent, selector: "chart-editor", host: { classAttribute: "chart-editor" }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChartEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'chart-editor',
                    template: `<ng-content></ng-content>`,
                    host: { class: 'chart-editor' },
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: ScriptLoaderService }]; } });

class DataTableService {
    create(data, columns, formatters) {
        if (data == null) {
            return undefined;
        }
        let firstRowIsData = true;
        if (columns != null) {
            firstRowIsData = false;
        }
        const dataTable = google.visualization.arrayToDataTable(this.getDataAsTable(data, columns), firstRowIsData);
        if (formatters) {
            this.applyFormatters(dataTable, formatters);
        }
        return dataTable;
    }
    getDataAsTable(data, columns) {
        if (columns) {
            return [columns, ...data];
        }
        else {
            return data;
        }
    }
    applyFormatters(dataTable, formatters) {
        for (const val of formatters) {
            val.formatter.format(dataTable, val.colIndex);
        }
    }
}
DataTableService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: DataTableService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
DataTableService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: DataTableService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: DataTableService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * Generates a random ID which can be used to uniquely identify an element.
 */
function generateRandomId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}

class ControlWrapperComponent {
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
ControlWrapperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ControlWrapperComponent, deps: [{ token: ScriptLoaderService }], target: i0.ɵɵFactoryTarget.Component });
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
        }], ctorParameters: function () { return [{ type: ScriptLoaderService }]; }, propDecorators: { for: [{
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

class DashboardComponent {
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
DashboardComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: DashboardComponent, deps: [{ token: i0.ElementRef }, { token: ScriptLoaderService }, { token: DataTableService }], target: i0.ɵɵFactoryTarget.Component });
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
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: ScriptLoaderService }, { type: DataTableService }]; }, propDecorators: { data: [{
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

class GoogleChartComponent {
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
        return Object.assign({ title: this.title, width: this.width, height: this.height }, this.options);
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
GoogleChartComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: GoogleChartComponent, deps: [{ token: i0.ElementRef }, { token: ScriptLoaderService }, { token: DataTableService }, { token: DashboardComponent, optional: true }], target: i0.ɵɵFactoryTarget.Component });
GoogleChartComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: GoogleChartComponent, selector: "google-chart", inputs: { type: "type", data: "data", columns: "columns", title: "title", width: "width", height: "height", options: "options", formatters: "formatters", dynamicResize: "dynamicResize" }, outputs: { ready: "ready", error: "error", select: "select", mouseover: "mouseover", mouseleave: "mouseleave" }, host: { classAttribute: "google-chart" }, exportAs: ["googleChart"], usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: GoogleChartComponent, decorators: [{
            type: Component,
            args: [{ selector: 'google-chart', template: '', host: { class: 'google-chart' }, exportAs: 'googleChart', changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"] }]
        }], ctorParameters: function () {
        return [{ type: i0.ElementRef }, { type: ScriptLoaderService }, { type: DataTableService }, { type: DashboardComponent, decorators: [{
                        type: Optional
                    }] }];
    }, propDecorators: { type: [{
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

class ChartWrapperComponent {
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
            const _a = this.specs, { containerId, container } = _a, specs = __rest(_a, ["containerId", "container"]);
            // Only ever create the wrapper once to allow animations to happen if something changes.
            this.wrapper = new google.visualization.ChartWrapper(Object.assign(Object.assign({}, specs), { container: this.element.nativeElement }));
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
ChartWrapperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChartWrapperComponent, deps: [{ token: i0.ElementRef }, { token: ScriptLoaderService }], target: i0.ɵɵFactoryTarget.Component });
ChartWrapperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: ChartWrapperComponent, selector: "chart-wrapper", inputs: { specs: "specs" }, outputs: { error: "error", ready: "ready", select: "select" }, host: { classAttribute: "chart-wrapper" }, exportAs: ["chartWrapper"], usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChartWrapperComponent, decorators: [{
            type: Component,
            args: [{ selector: 'chart-wrapper', template: '', host: { class: 'chart-wrapper' }, exportAs: 'chartWrapper', changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: ScriptLoaderService }]; }, propDecorators: { specs: [{
                type: Input
            }], error: [{
                type: Output
            }], ready: [{
                type: Output
            }], select: [{
                type: Output
            }] } });

var FilterType;
(function (FilterType) {
    FilterType["Category"] = "CategoryFilter";
    FilterType["ChartRange"] = "ChartRangeFilter";
    FilterType["DateRange"] = "DateRangeFilter";
    FilterType["NumberRange"] = "NumberRangeFilter";
    FilterType["String"] = "StringFilter";
})(FilterType || (FilterType = {}));

class GoogleChartsModule {
    static forRoot(config = {}) {
        return {
            ngModule: GoogleChartsModule,
            providers: [{ provide: GOOGLE_CHARTS_CONFIG, useValue: config }]
        };
    }
}
GoogleChartsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: GoogleChartsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
GoogleChartsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: GoogleChartsModule, declarations: [GoogleChartComponent,
        ChartWrapperComponent,
        DashboardComponent,
        ControlWrapperComponent,
        ChartEditorComponent], exports: [GoogleChartComponent,
        ChartWrapperComponent,
        DashboardComponent,
        ControlWrapperComponent,
        ChartEditorComponent] });
GoogleChartsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: GoogleChartsModule, providers: [ScriptLoaderService] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: GoogleChartsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        GoogleChartComponent,
                        ChartWrapperComponent,
                        DashboardComponent,
                        ControlWrapperComponent,
                        ChartEditorComponent
                    ],
                    providers: [ScriptLoaderService],
                    exports: [
                        GoogleChartComponent,
                        ChartWrapperComponent,
                        DashboardComponent,
                        ControlWrapperComponent,
                        ChartEditorComponent
                    ]
                }]
        }] });

/*
 * Public API Surface of angular-google-charts
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ChartEditorComponent, ChartEditorRef, ChartType, ChartWrapperComponent, ControlWrapperComponent, DashboardComponent, FilterType, GOOGLE_CHARTS_CONFIG, GOOGLE_CHARTS_LAZY_CONFIG, GoogleChartComponent, GoogleChartsModule, ScriptLoaderService, getDefaultConfig, getPackageForChart };
//# sourceMappingURL=angular-google-charts.mjs.map