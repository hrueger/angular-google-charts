import { Inject, Injectable, LOCALE_ID, NgZone } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { getDefaultConfig } from '../helpers/chart.helper';
import { GOOGLE_CHARTS_LAZY_CONFIG } from '../types/google-charts-config';
import * as i0 from "@angular/core";
import * as i1 from "rxjs";
export class ScriptLoaderService {
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
            return { ...getDefaultConfig(), ...(config || {}) };
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
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: i1.Observable, decorators: [{
                    type: Inject,
                    args: [GOOGLE_CHARTS_LAZY_CONFIG]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LWxvYWRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbGlicy9hbmd1bGFyLWdvb2dsZS1jaGFydHMvc3JjL2xpYi9zZXJ2aWNlcy9zY3JpcHQtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RSxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFMUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDM0QsT0FBTyxFQUFzQix5QkFBeUIsRUFBRSxNQUFNLCtCQUErQixDQUFDOzs7QUFHOUYsTUFBTSxPQUFPLG1CQUFtQjtJQUk5QixZQUNVLElBQVksRUFDTyxRQUFnQixFQUNTLE9BQXVDO1FBRm5GLFNBQUksR0FBSixJQUFJLENBQVE7UUFDTyxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ1MsWUFBTyxHQUFQLE9BQU8sQ0FBZ0M7UUFONUUsaUJBQVksR0FBRywwQ0FBMEMsQ0FBQztRQUMxRCxzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO0lBTXJELENBQUM7SUFFTDs7Ozs7O09BTUc7SUFDSSx1QkFBdUI7UUFDNUIsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksT0FBTyxNQUFNLENBQUMsTUFBTSxLQUFLLFdBQVcsRUFBRTtZQUN6RSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksaUJBQWlCLENBQUMsR0FBRyxRQUFrQjtRQUM1QyxPQUFPLElB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Q0FBQztRQUNoRCxNQUFNLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMvQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNwQixRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7O2dIQTNHVSxtQkFBbUIsd0NBTXBCLFNBQVMsYUFDVCx5QkFBeUI7b0hBUHhCLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQUQvQixVQUFVOzswQkFPTixNQUFNOzJCQUFDLFNBQVM7OzBCQUNoQixNQUFNOzJCQUFDLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgTE9DQUxFX0lELCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwLCBtZXJnZU1hcCwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuaW1wb3J0IHsgZ2V0RGVmYXVsdENvbmZpZyB9IGZyb20gJy4uL2hlbHBlcnMvY2hhcnQuaGVscGVyJztcclxuaW1wb3J0IHsgR29vZ2xlQ2hhcnRzQ29uZmlnLCBHT09HTEVfQ0hBUlRTX0xBWllfQ09ORklHIH0gZnJvbSAnLi4vdHlwZXMvZ29vZ2xlLWNoYXJ0cy1jb25maWcnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgU2NyaXB0TG9hZGVyU2VydmljZSB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBzY3JpcHRTb3VyY2UgPSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vY2hhcnRzL2xvYWRlci5qcyc7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBzY3JpcHRMb2FkU3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXHJcbiAgICBASW5qZWN0KExPQ0FMRV9JRCkgcHJpdmF0ZSBsb2NhbGVJZDogc3RyaW5nLFxyXG4gICAgQEluamVjdChHT09HTEVfQ0hBUlRTX0xBWllfQ09ORklHKSBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZyQ6IE9ic2VydmFibGU8R29vZ2xlQ2hhcnRzQ29uZmlnPlxyXG4gICkgeyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrcyB3aGV0aGVyIGBnb29nbGUuY2hhcnRzYCBpcyBhdmFpbGFibGUuXHJcbiAgICpcclxuICAgKiBJZiBub3QsIGl0IGNhbiBiZSBsb2FkZWQgYnkgY2FsbGluZyBgbG9hZENoYXJ0UGFja2FnZXNgLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgYHRydWVgIGlmIGBnb29nbGUuY2hhcnRzYCBpcyBhdmFpbGFibGUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBpc0dvb2dsZUNoYXJ0c0F2YWlsYWJsZSgpOiBib29sZWFuIHtcclxuICAgIGlmICh0eXBlb2YgZ29vZ2xlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZ29vZ2xlLmNoYXJ0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9hZHMgdGhlIEdvb2dsZSBDaGFydCBzY3JpcHQgYW5kIHRoZSBwcm92aWRlZCBjaGFydCBwYWNrYWdlcy5cclxuICAgKiBDYW4gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzIHRvIGxvYWQgbW9yZSBwYWNrYWdlcy5cclxuICAgKlxyXG4gICAqIFdoZW4gY2FsbGVkIHdpdGhvdXQgYW55IGFyZ3VtZW50cywgdGhpcyB3aWxsIGp1c3QgbG9hZCB0aGUgZGVmYXVsdCBwYWNrYWdlXHJcbiAgICogY29udGFpbmluZyB0aGUgbmFtZXNwYWNlcyBgZ29vZ2xlLmNoYXJ0c2AgYW5kIGBnb29nbGUudmlzdWFsaXphdGlvbmAgd2l0aG91dCBhbnkgY2hhcnRzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhY2thZ2VzIFRoZSBwYWNrYWdlcyB0byBsb2FkLlxyXG4gICAqIEByZXR1cm5zIEEgc3RyZWFtIGVtaXR0aW5nIGFzIHNvb24gYXMgdGhlIGNoYXJ0IHBhY2thZ2VzIGFyZSBsb2FkZWQuXHJcbiAgICovXHJcbiAgcHVibGljIGxvYWRDaGFydFBhY2thZ2VzKC4uLnBhY2thZ2VzOiBzdHJpbmdbXSk6IE9ic2VydmFibGU8bnVsbD4ge1xyXG4gICAgcmV0dXJuIHRoaXMubG9hZEdvb2dsZUNoYXJ0cygpLnBpcGUoXHJcbiAgICAgIG1lcmdlTWFwKCgpID0+IHRoaXMuY29uZmlnJCksXHJcbiAgICAgIG1hcChjb25maWcgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IC4uLmdldERlZmF1bHRDb25maWcoKSwgLi4uKGNvbmZpZyB8fCB7fSkgfTtcclxuICAgICAgfSksXHJcbiAgICAgIHN3aXRjaE1hcCgoZ29vZ2xlQ2hhcnRzQ29uZmlnOiBHb29nbGVDaGFydHNDb25maWcpID0+IHtcclxuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8bnVsbD4ob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICAgICAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgICAgICAgICBwYWNrYWdlcyxcclxuICAgICAgICAgICAgbGFuZ3VhZ2U6IHRoaXMubG9jYWxlSWQsXHJcbiAgICAgICAgICAgIG1hcHNBcGlLZXk6IGdvb2dsZUNoYXJ0c0NvbmZpZy5tYXBzQXBpS2V5LFxyXG4gICAgICAgICAgICBzYWZlTW9kZTogZ29vZ2xlQ2hhcnRzQ29uZmlnLnNhZmVNb2RlXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGdvb2dsZS5jaGFydHMubG9hZChnb29nbGVDaGFydHNDb25maWcudmVyc2lvbiEsIGNvbmZpZyk7XHJcbiAgICAgICAgICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xyXG4gICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9hZHMgdGhlIEdvb2dsZSBDaGFydHMgc2NyaXB0LiBBZnRlciB0aGUgc2NyaXB0IGlzIGxvYWRlZCwgYGdvb2dsZS5jaGFydHNgIGlzIGRlZmluZWQuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHN0cmVhbSBlbWl0dGluZyBhcyBzb29uIGFzIGxvYWRpbmcgaGFzIGNvbXBsZXRlZC5cclxuICAgKiBJZiB0aGUgZ29vZ2xlIGNoYXJ0cyBzY3JpcHQgaXMgYWxyZWFkeSBsb2FkZWQsIHRoZSBzdHJlYW0gZW1pdHMgaW1tZWRpYXRlbHkuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBsb2FkR29vZ2xlQ2hhcnRzKCk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgaWYgKHRoaXMuaXNHb29nbGVDaGFydHNBdmFpbGFibGUoKSkge1xyXG4gICAgICByZXR1cm4gb2YodW5kZWZpbmVkKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNMb2FkaW5nR29vZ2xlQ2hhcnRzKCkpIHtcclxuICAgICAgY29uc3Qgc2NyaXB0ID0gdGhpcy5jcmVhdGVHb29nbGVDaGFydHNTY3JpcHQoKTtcclxuICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc2NyaXB0TG9hZFN1YmplY3QubmV4dCgpO1xyXG4gICAgICAgICAgdGhpcy5zY3JpcHRMb2FkU3ViamVjdC5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZCB0aGUgZ29vZ2xlIGNoYXJ0cyBzY3JpcHQhJyk7XHJcbiAgICAgICAgICB0aGlzLnNjcmlwdExvYWRTdWJqZWN0LmVycm9yKG5ldyBFcnJvcignRmFpbGVkIHRvIGxvYWQgdGhlIGdvb2dsZSBjaGFydHMgc2NyaXB0IScpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zY3JpcHRMb2FkU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNMb2FkaW5nR29vZ2xlQ2hhcnRzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0R29vZ2xlQ2hhcnRzU2NyaXB0KCkgIT0gbnVsbDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0R29vZ2xlQ2hhcnRzU2NyaXB0KCk6IEhUTUxTY3JpcHRFbGVtZW50IHwgdW5kZWZpbmVkIHtcclxuICAgIGNvbnN0IHBhZ2VTY3JpcHRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JykpO1xyXG4gICAgcmV0dXJuIHBhZ2VTY3JpcHRzLmZpbmQoc2NyaXB0ID0+IHNjcmlwdC5zcmMgPT09IHRoaXMuc2NyaXB0U291cmNlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlR29vZ2xlQ2hhcnRzU2NyaXB0KCk6IEhUTUxTY3JpcHRFbGVtZW50IHtcclxuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuICAgIHNjcmlwdC5zcmMgPSB0aGlzLnNjcmlwdFNvdXJjZTtcclxuICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICByZXR1cm4gc2NyaXB0O1xyXG4gIH1cclxufVxyXG4iXX0=