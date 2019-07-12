import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table.component';
import { AppComponent } from './app.component';
import { TableDataProviderConfig, Table, TableCellFormatMap, HLC_CLR_TABLE_CELL_FORMAT_MAP } from '@ng-holistic/clr-list';
import { ClrDatagridStateInterface } from '@clr/angular';

import {
    HlcClrTableModule
} from '@ng-holistic/clr-list';

// CLARITY ICONS DEPENDENCY: THIS REQUIRED ONLY IN STACKBLITZ SEE #700
import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
//


// In this sample app we don't use application domain or for this case
// condider dto model = application domain model
// TableDataProviderConfig is the adepter interface which helps map 
// data from application (dto in this case) model to list component model
const tableDataProviderConfig: TableDataProviderConfig = {
    mapState(state: ClrDatagridStateInterface): any {
      return {
        page: state.page.from / state.page.size + 1
      }
    },
    mapResult(result: any): Table.Data.Result{
       const pageIndex = 1;
       return {
         rows: result.results,
         paginator: {
           length: result.count,
           pageIndex,
           pageSize: 10
         }
       }  
    }                    
}

// Provide default formatters for table defintion  
// If a lot of cells in various tables use the same formatter it is a good idea
// to configure this formatter for whole application and then reference it in table cell definition
export const getTableCellFormatMap = (datePipe: DatePipe, decimalPipe: DecimalPipe): TableCellFormatMap => ({
    // if formatter returns string it considered formatted value
    date: x => datePipe.transform(x),
    // if formatter return { val: 'val', cls: 'cls' } object it considered val as formatted value and 
    // cls is a class to apply to cell content
    decimal: x => ({
      val: decimalPipe.transform(x),
      // define global css style for this class inside styles.css
      cls: 'number-cell'
    })
});


@NgModule({
  imports: [ BrowserModule, FormsModule, CommonModule, HlcClrTableModule.forRoot() ],
  declarations: [ AppComponent, TableComponent ],
  bootstrap:    [ AppComponent ],
  providers: [
        DatePipe,
        DecimalPipe,
        {
            provide: HLC_CLR_TABLE_CELL_FORMAT_MAP,
            useFactory: getTableCellFormatMap,
            deps: [DatePipe, DecimalPipe],
            multi: true
        }
  ]
})
export class AppModule { }
