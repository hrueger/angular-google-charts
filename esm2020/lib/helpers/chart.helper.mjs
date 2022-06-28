import { ChartType } from '../types/chart-type';
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
export function getPackageForChart(type) {
    return ChartTypesToPackages[type];
}
export function getDefaultConfig() {
    return {
        version: 'current',
        safeMode: false
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbGlicy9hbmd1bGFyLWdvb2dsZS1jaGFydHMvc3JjL2xpYi9oZWxwZXJzL2NoYXJ0LmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHaEQsTUFBTSxvQkFBb0IsR0FBRztJQUMzQixDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBRSxpQkFBaUI7SUFDOUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsV0FBVztJQUNsQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO0lBQ3RCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFdBQVc7SUFDakMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsV0FBVztJQUNwQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVO0lBQ2hDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsV0FBVztJQUN6QyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxXQUFXO0lBQ3BDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFdBQVc7SUFDbkMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsV0FBVztJQUNqQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPO0lBQzFCLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU87SUFDMUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVTtJQUNoQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxXQUFXO0lBQ2xDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU07SUFDeEIsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsV0FBVztJQUNsQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO0lBQ3RCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVU7SUFDaEMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUTtJQUM1QixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTO0lBQzlCLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFFLFdBQVc7SUFDckMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxXQUFXO0lBQ3pDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU87SUFDMUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVTtJQUNoQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTO0lBQzlCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVU7Q0FDakMsQ0FBQztBQUVGLE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxJQUFlO0lBQ2hELE9BQU8sb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0I7SUFDOUIsT0FBTztRQUNMLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLFFBQVEsRUFBRSxLQUFLO0tBQ2hCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhcnRUeXBlIH0gZnJvbSAnLi4vdHlwZXMvY2hhcnQtdHlwZSc7XHJcbmltcG9ydCB7IEdvb2dsZUNoYXJ0c0NvbmZpZyB9IGZyb20gJy4uL3R5cGVzL2dvb2dsZS1jaGFydHMtY29uZmlnJztcclxuXHJcbmNvbnN0IENoYXJ0VHlwZXNUb1BhY2thZ2VzID0ge1xyXG4gIFtDaGFydFR5cGUuQW5ub3RhdGlvbkNoYXJ0XTogJ2Fubm90YXRpb25jaGFydCcsXHJcbiAgW0NoYXJ0VHlwZS5BcmVhQ2hhcnRdOiAnY29yZWNoYXJ0JyxcclxuICBbQ2hhcnRUeXBlLkJhcl06ICdiYXInLFxyXG4gIFtDaGFydFR5cGUuQmFyQ2hhcnRdOiAnY29yZWNoYXJ0JyxcclxuICBbQ2hhcnRUeXBlLkJ1YmJsZUNoYXJ0XTogJ2NvcmVjaGFydCcsXHJcbiAgW0NoYXJ0VHlwZS5DYWxlbmRhcl06ICdjYWxlbmRhcicsXHJcbiAgW0NoYXJ0VHlwZS5DYW5kbGVzdGlja0NoYXJ0XTogJ2NvcmVjaGFydCcsXHJcbiAgW0NoYXJ0VHlwZS5Db2x1bW5DaGFydF06ICdjb3JlY2hhcnQnLFxyXG4gIFtDaGFydFR5cGUuQ29tYm9DaGFydF06ICdjb3JlY2hhcnQnLFxyXG4gIFtDaGFydFR5cGUuUGllQ2hhcnRdOiAnY29yZWNoYXJ0JyxcclxuICBbQ2hhcnRUeXBlLkdhbnR0XTogJ2dhbnR0JyxcclxuICBbQ2hhcnRUeXBlLkdhdWdlXTogJ2dhdWdlJyxcclxuICBbQ2hhcnRUeXBlLkdlb0NoYXJ0XTogJ2dlb2NoYXJ0JyxcclxuICBbQ2hhcnRUeXBlLkhpc3RvZ3JhbV06ICdjb3JlY2hhcnQnLFxyXG4gIFtDaGFydFR5cGUuTGluZV06ICdsaW5lJyxcclxuICBbQ2hhcnRUeXBlLkxpbmVDaGFydF06ICdjb3JlY2hhcnQnLFxyXG4gIFtDaGFydFR5cGUuTWFwXTogJ21hcCcsXHJcbiAgW0NoYXJ0VHlwZS5PcmdDaGFydF06ICdvcmdjaGFydCcsXHJcbiAgW0NoYXJ0VHlwZS5TYW5rZXldOiAnc2Fua2V5JyxcclxuICBbQ2hhcnRUeXBlLlNjYXR0ZXJdOiAnc2NhdHRlcicsXHJcbiAgW0NoYXJ0VHlwZS5TY2F0dGVyQ2hhcnRdOiAnY29yZWNoYXJ0JyxcclxuICBbQ2hhcnRUeXBlLlN0ZXBwZWRBcmVhQ2hhcnRdOiAnY29yZWNoYXJ0JyxcclxuICBbQ2hhcnRUeXBlLlRhYmxlXTogJ3RhYmxlJyxcclxuICBbQ2hhcnRUeXBlLlRpbWVsaW5lXTogJ3RpbWVsaW5lJyxcclxuICBbQ2hhcnRUeXBlLlRyZWVNYXBdOiAndHJlZW1hcCcsXHJcbiAgW0NoYXJ0VHlwZS5Xb3JkVHJlZV06ICd3b3JkdHJlZSdcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWNrYWdlRm9yQ2hhcnQodHlwZTogQ2hhcnRUeXBlKTogc3RyaW5nIHtcclxuICByZXR1cm4gQ2hhcnRUeXBlc1RvUGFja2FnZXNbdHlwZV07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0Q29uZmlnKCk6IEdvb2dsZUNoYXJ0c0NvbmZpZyB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHZlcnNpb246ICdjdXJyZW50JyxcclxuICAgIHNhZmVNb2RlOiBmYWxzZVxyXG4gIH07XHJcbn1cclxuIl19