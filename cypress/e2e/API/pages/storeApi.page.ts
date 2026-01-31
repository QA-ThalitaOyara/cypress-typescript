import { Order, Inventory } from '../../../types/store';
import { ApiBase } from '../common/apiBase';
import { UrlBuilder } from '../common/urlBuilder';
import { HeaderFactory } from '../common/headerFactory';

export default class StoreApi {
  private static urlBuilder = new UrlBuilder('/v2');

  /**
   * Gets the store inventory
   */
  static getInventory() {
    const url = this.urlBuilder.build('/store/inventory');
    return ApiBase.request<Inventory>('GET', url, HeaderFactory.baseHeaders());
  }

  /**
   * Places a new order
   */
  static placeOrder(order: Order) {
    const url = this.urlBuilder.build('/store/order');
    return ApiBase.request<Order>('POST', url, HeaderFactory.baseHeaders(), order);
  }

  /**
   * Gets an order by ID
   */
  static getOrderById(orderId: number) {
    const url = this.urlBuilder.build('/store/order/{orderId}', { orderId });
    return ApiBase.request<Order>('GET', url, HeaderFactory.baseHeaders());
  }

  /**
   * Deletes an order by ID
   */
  static deleteOrder(orderId: number) {
    const url = this.urlBuilder.build('/store/order/{orderId}', { orderId });
    return ApiBase.request<{}>('DELETE', url, HeaderFactory.baseHeaders());
  }
}