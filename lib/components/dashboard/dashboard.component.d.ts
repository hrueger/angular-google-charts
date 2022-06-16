import { ElementRef, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataTableService } from '../../services/data-table.service';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartErrorEvent } from '../../types/events';
import { Formatter } from '../../types/formatter';
import { Column, Row } from '../chart-base/chart-base.component';
import * as i0 from "@angular/core";
export declare class DashboardComponent implements OnInit, OnChanges {
    private element;
    private loaderService;
    private dataTableService;
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
     * Used to change the displayed value of the specified column in all rows.
     *
     * Each array element must consist of an instance of a [`formatter`](https://developers.google.com/chart/interactive/docs/reference#formatters)
     * and the index of the column you want the formatter to get applied to.
     */
    formatters?: Formatter[];
    /**
     * The dashboard has completed drawing and is ready to accept changes.
     *
     * The ready event will also fire:
     * - after the completion of a dashboard refresh triggered by a user or programmatic interaction with one of the controls,
     * - after redrawing any chart on the dashboard.
     */
    ready: EventEmitter<void>;
    /**
     * Emits when an error occurs when attempting to render the dashboard.
     * One or more of the controls and charts that are part of the dashboard may have failed rendering.
     */
    error: EventEmitter<ChartErrorEvent>;
    private controlWrappers;
    private dashboard?;
    private dataTable?;
    private initialized;
    constructor(element: ElementRef, loaderService: ScriptLoaderService, dataTableService: DataTableService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private createDashboard;
    private registerEvents;
    private initializeBindings;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DashboardComponent, "dashboard", ["dashboard"], { "data": "data"; "columns": "columns"; "formatters": "formatters"; }, { "ready": "ready"; "error": "error"; }, ["controlWrappers"], ["*"], false>;
}
