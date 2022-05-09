/// <reference types="@types/google.visualization" />
import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { FilterType } from '../../types/control-type';
import { ChartErrorEvent, ChartReadyEvent } from '../../types/events';
import { ChartBase } from '../chart-base/chart-base.component';
import * as i0 from "@angular/core";
export declare class ControlWrapperComponent implements OnInit, OnChanges {
    private loaderService;
    /**
     * Charts controlled by this control wrapper. Can be a single chart or an array of charts.
     */
    for: ChartBase | ChartBase[];
    /**
     * The class name of the control.
     * The `google.visualization` package name can be omitted for Google controls.
     *
     * @example
     *
     * ```html
     * <control-wrapper type="CategoryFilter"></control-wrapper>
     * ```
     */
    type: FilterType;
    /**
     * An object describing the options for the control.
     * You can use either JavaScript literal notation, or provide a handle to the object.
     *
     * @example
     *
     * ```html
     * <control-wrapper [options]="{'filterColumnLabel': 'Age', 'minValue': 10, 'maxValue': 80}"></control-wrapper>
     * ```
     */
    options?: object;
    /**
     * An object describing the state of the control.
     * The state collects all the variables that the user operating the control can affect.
     *
     * For example, a range slider state can be described in term of the positions that the low and high thumb
     * of the slider occupy.
     * You can use either Javascript literal notation, or provide a handle to the object.
     *
     * @example
     *
     *  ```html
     * <control-wrapper [state]="{'lowValue': 20, 'highValue': 50}"></control-wrapper>
     * ```
     */
    state?: object;
    /**
     * Emits when an error occurs when attempting to render the control.
     */
    error: EventEmitter<ChartErrorEvent>;
    /**
     * The control is ready to accept user interaction and for external method calls.
     *
     * Alternatively, you can listen for a ready event on the dashboard holding the control
     * and call control methods only after the event was fired.
     */
    ready: EventEmitter<ChartReadyEvent<google.visualization.ChartBase>>;
    /**
     * Emits when the user interacts with the control, affecting its state.
     * For example, a `stateChange` event will be emitted whenever you move the thumbs of a range slider control.
     *
     * To retrieve an updated control state after the event fired, call `ControlWrapper.getState()`.
     */
    stateChange: EventEmitter<unknown>;
    /**
     * A generated id assigned to this components DOM element.
     */
    readonly id: string;
    private _controlWrapper?;
    private wrapperReadySubject;
    constructor(loaderService: ScriptLoaderService);
    /**
     * Emits after the `ControlWrapper` was created.
     */
    get wrapperReady$(): import("rxjs").Observable<google.visualization.ControlWrapper>;
    get controlWrapper(): google.visualization.ControlWrapper;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private createControlWrapper;
    private addEventListeners;
    static ɵfac: i0.ɵɵFactoryDeclaration<ControlWrapperComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ControlWrapperComponent, "control-wrapper", ["controlWrapper"], { "for": "for"; "type": "type"; "options": "options"; "state": "state"; }, { "error": "error"; "ready": "ready"; "stateChange": "stateChange"; }, never, never>;
}
