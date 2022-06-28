import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleChartsConfig } from '../types/google-charts-config';
import * as i0 from "@angular/core";
export declare class ScriptLoaderService {
    private zone;
    private localeId;
    private readonly config$;
    private readonly scriptSource;
    private readonly scriptLoadSubject;
    constructor(zone: NgZone, localeId: string, config$: Observable<GoogleChartsConfig>);
    /**
     * Checks whether `google.charts` is available.
     *
     * If not, it can be loaded by calling `loadChartPackages`.
     *
     * @returns `true` if `google.charts` is available, `false` otherwise.
     */
    isGoogleChartsAvailable(): boolean;
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
    loadChartPackages(...packages: string[]): Observable<null>;
    /**
     * Loads the Google Charts script. After the script is loaded, `google.charts` is defined.
     *
     * @returns A stream emitting as soon as loading has completed.
     * If the google charts script is already loaded, the stream emits immediately.
     */
    private loadGoogleCharts;
    private isLoadingGoogleCharts;
    private getGoogleChartsScript;
    private createGoogleChartsScript;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScriptLoaderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ScriptLoaderService>;
}