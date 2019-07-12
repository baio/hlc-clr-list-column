import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Table, TableDescription } from '@ng-holistic/clr-list';
import { Subject, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

const capitalize = (str: string) => str[0].toUpperCase() + str.substr(1);

type FormatDate = (s: string) => string;

// Provide table UI definition in js object
const getTable = (formatDate: FormatDate): TableDescription => ({
    cols: [
        {
            id: 'title',
            title: 'Title',
            // sort column, the sort field in data provider state argument will have name equal to the column id i.e. 'title' if sort by column is requested (see Data Provider and Data Provider Config)
            sort: true,
            // cls - set class on cell content
            cls: 'title',
            // format - function to format cell value to displayed string, 
            // first arg is the cell value and second optional is the row object itself
            // formatter also could return { val: 'val', cls: 'cls' } object 
            // it will be considered `val` as a formatted value to display
            // and `cls` is a class to apply to cell content
            format: capitalize
        },
        {
            id: 'amount',
            title: 'Amount',
            // can omit this, by default columns is not sortable
            sort: false,            
            // cls - set class of cell content based on condition
            // conditional function has cell value as a first param and optional second param - row itself
            // Notice if you return object with { cls: 'class name' } from 'format' property it will
            // be joined to value from here 
            cls:  val => val > 200000 ? 'highlight' : undefined,
            // format - You also could provide string which references formatter configured in HLC_CLR_TABLE_CELL_FORMAT_MAP provider
            format: 'decimal'
        },
        {
            id: 'createdDate',
            title: 'Created',
            // the same as sort: true, but sort field will have name equal to the value from here i.e. 'date'
            sort: 'date',            
            // This one is just for an example, it is recommended to use default formatters map 
            // (see app.module HLC_CLR_TABLE_CELL_FORMAT_MAP)
            // to define map of default formatters which could be used across the application simple by
            // using reference name. Example - `format: 'date'`
            format: formatDate
        }
    ]
});

// Provide data for the table
const rows: Table.Row[] = [
    {
        id: '1',
        title: 'aaaa',
        amount: 200000,
        createdDate: new Date().setMonth(1)
    },
    {
        id: '2',
        title: 'bbb',
        amount: 300000,
        createdDate: new Date().setMonth(2)
    }
];

const dataProvider: Table.Data.DataProvider = {
    load(state) {
        console.log(state);
        return timer(0).pipe(mapTo({ rows }));
    }
};

@Component({
  selector: 'my-table',
  template: '<hlc-clr-table [table]="table" [dataProvider]="dataProvider"></hlc-clr-table>',
  styleUrls: [ './table.component.scss' ],
  providers: [DatePipe]
})
export class TableComponent  {
  readonly table: TableDescription;
  dataProvider = dataProvider;
  constructor(datePipe: DatePipe) {
    const fd: FormatDate = d => datePipe.transform(d);
    this.table = getTable(fd);
  }
}
