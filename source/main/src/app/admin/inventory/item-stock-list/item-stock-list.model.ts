import { formatDate } from '@angular/common';
export class ItemStockList {
  id: number;
  i_name: string;
  category: string;
  qty: string;
  date: string;
  price: string;
  details: string;
  constructor(itemStockList: ItemStockList) {
    {
      this.id = itemStockList.id ;
      this.i_name = itemStockList.i_name || '';
      this.category = itemStockList.category || '';
      this.qty = itemStockList.qty || '';
      this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.price = itemStockList.price || '';
      this.details = itemStockList.details || '';
    }
  }

}
