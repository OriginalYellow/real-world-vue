interface DataItem {
  key: any;
  [key: string]: any;
}

export interface DataGridProps {
  data: Array<DataItem>;
  columns: Array<string>;
  filterKey?: string;
}