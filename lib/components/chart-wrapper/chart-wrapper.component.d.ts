/// <reference types="@types/google.visualization" />
import { ElementRef, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartErrorEvent, ChartReadyEvent, ChartSelectionChangedEvent } from '../../types/events';
import { ChartBase } from '../chart-base/chart-base.component';
import * as i0 from "@angular/core";
export declare class ChartWrapperComponent implements ChartBase, OnChanges, OnInit {
    private element;
    private scriptLoaderService;
    /**
     * Either a JSON object defining the chart, or a serialized string version of that object.
     * The format of this object is shown in the
     * {@link https://developers.google.com/chart/interactive/docs/reference#google.visualization.drawchart `drawChart()`} documentation.
     *
     * The `container` and `containerId` will be overwritten by this component to allow
     * rendering the chart into the components' template.
     */
    specs?: google.visualization.ChartSpecs;
    error: EventEmitter<ChartErrorEvent>;
    ready: EventEmitter<ChartReadyEvent<google.visualization.ChartBase>>;
    select: EventEmitter<ChartSelectionChangedEvent>;
    private wrapper;
    private wrapperReadySubject;
    private initialized;
    constructor(element: ElementRef, scriptLoaderService: ScriptLoaderService);
    get chart(): google.visualization.ChartBase | null;
    get wrapperReady$(): import("rxjs").Observable<google.visualization.ChartWrapper>;
    get chartWrapper(): google.visualization.ChartWrapper;
    set chartWrapper(wrapper: google.visualization.ChartWrapper);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private updateChart;
    private drawChart;
    private registerChartEvents;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartWrapperComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChartWrapperComponent, "chart-wrapper", ["chartWrapper"], { "specs": "specs"; }, { "error": "error"; "ready": "ready"; "select": "select"; }, never, never, false>;
}