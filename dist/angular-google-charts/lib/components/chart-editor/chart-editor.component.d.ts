/// <reference path="types.d.ts" />
import { OnInit } from '@angular/core';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartBase } from '../chart-base/chart-base.component';
import { ChartEditorRef } from './chart-editor-ref';
import * as i0 from "@angular/core";
export declare class ChartEditorComponent implements OnInit {
    private scriptLoaderService;
    private editor;
    private initializedSubject;
    constructor(scriptLoaderService: ScriptLoaderService);
    /**
     * Emits as soon as the chart editor is fully initialized.
     */
    get initialized$(): import("rxjs").Observable<google.visualization.ChartEditor>;
    ngOnInit(): void;
    /**
     * Opens the chart editor as an embedded dialog box on the page.
     * If the editor gets saved, the components' chart will be updated with the result.
     *
     * @param component The chart to be edited.
     * @returns A reference to the open editor.
     */
    editChart(component: ChartBase): ChartEditorRef;
    editChart(component: ChartBase, options: google.visualization.ChartEditorOptions): ChartEditorRef;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChartEditorComponent, "chart-editor", never, {}, {}, never, ["*"]>;
}
