import { NgModule } from '@angular/core';
import { ChartEditorComponent } from './components/chart-editor/chart-editor.component';
import { ChartWrapperComponent } from './components/chart-wrapper/chart-wrapper.component';
import { ControlWrapperComponent } from './components/control-wrapper/control-wrapper.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GoogleChartComponent } from './components/google-chart/google-chart.component';
import { ScriptLoaderService } from './services/script-loader.service';
import { GOOGLE_CHARTS_CONFIG } from './types/google-charts-config';
import * as i0 from "@angular/core";
export class GoogleChartsModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2FuZ3VsYXItZ29vZ2xlLWNoYXJ0cy9zcmMvbGliL2dvb2dsZS1jaGFydHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQzNGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBc0Isb0JBQW9CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7QUFtQnhGLE1BQU0sT0FBTyxrQkFBa0I7SUFDdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUE2QixFQUFFO1FBQ25ELE9BQU87WUFDTCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUNqRSxDQUFDO0lBQ0osQ0FBQzs7K0dBTlUsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBZjNCLG9CQUFvQjtRQUNwQixxQkFBcUI7UUFDckIsa0JBQWtCO1FBQ2xCLHVCQUF1QjtRQUN2QixvQkFBb0IsYUFJcEIsb0JBQW9CO1FBQ3BCLHFCQUFxQjtRQUNyQixrQkFBa0I7UUFDbEIsdUJBQXVCO1FBQ3ZCLG9CQUFvQjtnSEFHWCxrQkFBa0IsYUFUbEIsQ0FBQyxtQkFBbUIsQ0FBQzsyRkFTckIsa0JBQWtCO2tCQWpCOUIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osb0JBQW9CO3dCQUNwQixxQkFBcUI7d0JBQ3JCLGtCQUFrQjt3QkFDbEIsdUJBQXVCO3dCQUN2QixvQkFBb0I7cUJBQ3JCO29CQUNELFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO29CQUNoQyxPQUFPLEVBQUU7d0JBQ1Asb0JBQW9CO3dCQUNwQixxQkFBcUI7d0JBQ3JCLGtCQUFrQjt3QkFDbEIsdUJBQXVCO3dCQUN2QixvQkFBb0I7cUJBQ3JCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IENoYXJ0RWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYXJ0LWVkaXRvci9jaGFydC1lZGl0b3IuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2hhcnRXcmFwcGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYXJ0LXdyYXBwZXIvY2hhcnQtd3JhcHBlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb250cm9sV3JhcHBlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jb250cm9sLXdyYXBwZXIvY29udHJvbC13cmFwcGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERhc2hib2FyZENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEdvb2dsZUNoYXJ0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2dvb2dsZS1jaGFydC9nb29nbGUtY2hhcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2NyaXB0TG9hZGVyU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgR29vZ2xlQ2hhcnRzQ29uZmlnLCBHT09HTEVfQ0hBUlRTX0NPTkZJRyB9IGZyb20gJy4vdHlwZXMvZ29vZ2xlLWNoYXJ0cy1jb25maWcnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEdvb2dsZUNoYXJ0Q29tcG9uZW50LFxyXG4gICAgQ2hhcnRXcmFwcGVyQ29tcG9uZW50LFxyXG4gICAgRGFzaGJvYXJkQ29tcG9uZW50LFxyXG4gICAgQ29udHJvbFdyYXBwZXJDb21wb25lbnQsXHJcbiAgICBDaGFydEVkaXRvckNvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbU2NyaXB0TG9hZGVyU2VydmljZV0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgR29vZ2xlQ2hhcnRDb21wb25lbnQsXHJcbiAgICBDaGFydFdyYXBwZXJDb21wb25lbnQsXHJcbiAgICBEYXNoYm9hcmRDb21wb25lbnQsXHJcbiAgICBDb250cm9sV3JhcHBlckNvbXBvbmVudCxcclxuICAgIENoYXJ0RWRpdG9yQ29tcG9uZW50XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgR29vZ2xlQ2hhcnRzTW9kdWxlIHtcclxuICBwdWJsaWMgc3RhdGljIGZvclJvb3QoY29uZmlnOiBHb29nbGVDaGFydHNDb25maWcgPSB7fSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8R29vZ2xlQ2hhcnRzTW9kdWxlPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogR29vZ2xlQ2hhcnRzTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IEdPT0dMRV9DSEFSVFNfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnIH1dXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=