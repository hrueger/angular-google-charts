/// <reference types="@types/google.visualization" />
import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTableService } from '../../services/data-table.service';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartType } from '../../types/chart-type';
import { ChartErrorEvent, ChartMouseLeaveEvent, ChartMouseOverEvent, ChartReadyEvent, ChartSelectionChangedEvent } from '../../types/events';
import { Formatter } from '../../types/formatter';
import { ChartBase, Column, Row } from '../chart-base/chart-base.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import * as i0 from "@angular/core";
export declare class GoogleChartComponent implements ChartBase, OnInit, OnChanges, OnDestroy {
    private element;
    private scriptLoaderService;
    private dataTableService;
    private dashboard?;
    /**
     * The type of the chart to create.
     */
    type: ChartType;
    /**
     * Data used to initialize the table.
     *
     * This must also contain all roles that are set in the `columns` property.
     */
    data: Row[];
    /**
     * The columns the `data` consists of.
     * The length of this array must match the length of each row in the `data` object.
     *
     * If {@link https://developers.google.com/chart/interactive/docs/roles roles} should be applied, they must be included in this array as well.
     */
    columns?: Column[];
    /**
     * A convenience property used to set the title of the chart.
     *
     * This can also be set using `options.title`, which, if existant, will overwrite this value.
     */
    title?: string;
    /**
     * A convenience property used to set the width of the chart in pixels.
     *
     * This can also be set using `options.width`, which, if existant, will overwrite this value.
     */
    width?: number;
    /**
     * A convenience property used to set the height of the chart in pixels.
     *
     * This can also be set using `options.height`, which, if existant, will overwrite this value.
     */
    height?: number;
    /**
     * The chart-specific options. All options listen in the Google Charts documentation applying
     * to the chart type specified can be used here.
     */
    options: object;
    /**
     * Used to change the displayed value of the specified column in all rows.
     *
     * Each array element must consist of an instance of a [`formatter`](https://developers.google.com/chart/interactive/docs/reference#formatters)
     * and the index of the column you want the formatter to get applied to.
     */
    formatters?: Formatter[];
    /**
     * If this is set to `true`, the chart will be redrawn if the browser window is resized.
     * Defaults to `false` and should only be used when specifying the width or height of the chart
     * in percent.
     *
     * Note that this can impact performance.
     */
    dynamicResize: boolean;
    ready: EventEmitter<ChartReadyEvent<google.visualization.ChartBase>>;
    error: EventEmitter<ChartErrorEvent>;
    select: EventEmitter<ChartSelectionChangedEvent>;
    mouseover: EventEmitter<ChartMouseOverEvent>;
    mouseleave: EventEmitter<ChartMouseLeaveEvent>;
    private resizeSubscription?;
    private dataTable;
    private wrapper;
    private wrapperReadySubject;
    private initialized;
    private eventListeners;
    constructor(element: ElementRef, scriptLoaderService: ScriptLoaderService, dataTableService: DataTableService, dashboard?: DashboardComponent | undefined);
    get chart(): google.visualization.ChartBase | null;
    get wrapperReady$(): Observable<google.visualization.ChartWrapper>;
    get chartWrapper(): google.visualization.ChartWrapper;
    set chartWrapper(wrapper: google.visualization.ChartWrapper);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * For listening to events other than the most common ones (available via Output properties).
     *
     * Can be called after the chart emits that it's "ready".
     *
     * Returns a handle that can be used for `removeEventListener`.
     */
    addEventListener(eventName: string, callback: Function): any;
    removeEventListener(handle: any): void;
    private updateResizeListener;
    private unsubscribeToResizeIfSubscribed;
    private mergeOptions;
    private registerChartEvents;
    private registerChartEvent;
    private drawChart;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoogleChartComponent, [null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GoogleChartComponent, "google-chart", ["googleChart"], { "type": "type"; "data": "data"; "columns": "columns"; "title": "title"; "width": "width"; "height": "height"; "options": "options"; "formatters": "formatters"; "dynamicResize": "dynamicResize"; }, { "ready": "ready"; "error": "error"; "select": "select"; "mouseover": "mouseover"; "mouseleave": "mouseleave"; }, never, never>;
}
