import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class DataTableService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10YWJsZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbGlicy9hbmd1bGFyLWdvb2dsZS1jaGFydHMvc3JjL2xpYi9zZXJ2aWNlcy9kYXRhLXRhYmxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFNM0MsTUFBTSxPQUFPLGdCQUFnQjtJQUNwQixNQUFNLENBQ1gsSUFBdUIsRUFDdkIsT0FBa0IsRUFDbEIsVUFBd0I7UUFFeEIsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ2hCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNuQixjQUFjLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO1FBRUQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUM1RyxJQUFJLFVBQVUsRUFBRTtZQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVPLGNBQWMsQ0FBQyxJQUFXLEVBQUUsT0FBNkI7UUFDL0QsSUFBSSxPQUFPLEVBQUU7WUFDWCxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDM0I7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRU8sZUFBZSxDQUFDLFNBQXlDLEVBQUUsVUFBdUI7UUFDeEYsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7WUFDNUIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUM7OzZHQW5DVSxnQkFBZ0I7aUhBQWhCLGdCQUFnQixjQURILE1BQU07MkZBQ25CLGdCQUFnQjtrQkFENUIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBDb2x1bW4sIFJvdyB9IGZyb20gJy4uL2NvbXBvbmVudHMvY2hhcnQtYmFzZS9jaGFydC1iYXNlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEZvcm1hdHRlciB9IGZyb20gJy4uL3R5cGVzL2Zvcm1hdHRlcic7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlU2VydmljZSB7XHJcbiAgcHVibGljIGNyZWF0ZShcclxuICAgIGRhdGE6IFJvd1tdIHwgdW5kZWZpbmVkLFxyXG4gICAgY29sdW1ucz86IENvbHVtbltdLFxyXG4gICAgZm9ybWF0dGVycz86IEZvcm1hdHRlcltdXHJcbiAgKTogZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmIChkYXRhID09IG51bGwpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZmlyc3RSb3dJc0RhdGEgPSB0cnVlO1xyXG4gICAgaWYgKGNvbHVtbnMgIT0gbnVsbCkge1xyXG4gICAgICBmaXJzdFJvd0lzRGF0YSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGFUYWJsZSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmFycmF5VG9EYXRhVGFibGUodGhpcy5nZXREYXRhQXNUYWJsZShkYXRhLCBjb2x1bW5zKSwgZmlyc3RSb3dJc0RhdGEpO1xyXG4gICAgaWYgKGZvcm1hdHRlcnMpIHtcclxuICAgICAgdGhpcy5hcHBseUZvcm1hdHRlcnMoZGF0YVRhYmxlLCBmb3JtYXR0ZXJzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0YVRhYmxlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXREYXRhQXNUYWJsZShkYXRhOiBSb3dbXSwgY29sdW1uczogQ29sdW1uW10gfCB1bmRlZmluZWQpOiAoUm93IHwgQ29sdW1uW10pW10ge1xyXG4gICAgaWYgKGNvbHVtbnMpIHtcclxuICAgICAgcmV0dXJuIFtjb2x1bW5zLCAuLi5kYXRhXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseUZvcm1hdHRlcnMoZGF0YVRhYmxlOiBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUsIGZvcm1hdHRlcnM6IEZvcm1hdHRlcltdKTogdm9pZCB7XHJcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBmb3JtYXR0ZXJzKSB7XHJcbiAgICAgIHZhbC5mb3JtYXR0ZXIuZm9ybWF0KGRhdGFUYWJsZSwgdmFsLmNvbEluZGV4KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19